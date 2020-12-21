// ==UserScript==
// @name         Add YouTube channel ID to URL
// @version      0.2
// @description  Adds the channel of the currently-playing YouTube video to the URL.
// @author       fishstik
// @match        https://*.youtube.com/*
// @grant        none
// @license      https://mit-license.org/
// @supportURL   https://github.com/fishstik/youtube-channel-in-url
// ==/UserScript==

// based on https://greasyfork.org/en/scripts/22308-youtube-whitelist-channels-in-ublock-origin

let exposeUserInURL = function() {
    'use strict';

    // get channel ID from href
    const link = document.querySelector('#upload-info ytd-channel-name yt-formatted-string.ytd-channel-name a.yt-simple-endpoint.yt-formatted-string');
    if (link === null) {
        mutationHandlerTimer = null;
        return;
    }
    const linkHref = link.getAttribute('href');
    const linkmatch = linkHref.match(/\/(user|channel)\/(.+)/);
    if (linkmatch === null) {
        return;
    }
    const channelId = linkmatch[2];

    // check if current channel ID already in URL
    const matches = location.search.match(/(?:[?&])(channel=(?:[^&]+|$))/);
    const oldArg = matches !== null ? matches[1] : '';
    const newArg = channelId !== '' ? 'channel=' + encodeURIComponent(channelId) : '';
    if ( newArg === oldArg ) {
        return;
    }
  
    // append/replace new channel ID in URL
    const href = location.href;
    let urlPath = '';
    if ( oldArg === '' ) {
        urlPath = href + (location.search === '' ? '?' : '&') + newArg;
    } else {
        urlPath = href.replace(oldArg, newArg)
    }
  
    // replace window URL, refreshing the page
    location.replace(urlPath);
    // this method does not refresh the page, but we need to if we want to reliably use it with other extensions
    //window.history.replaceState(null, document.title, urlPath);
    
};

// observe DOM modifications
var mutationHandler = function(mutations) {
    'use strict';

    for ( var i = 0; i < mutations.length; i++ ) {
        if ( mutations[i].addedNodes ) {
            setTimeout(exposeUserInURL, 25);
            break;
        }
    }
};

var observer = new MutationObserver(mutationHandler);
observer.observe(document.body, { childList: true, subtree: true });
