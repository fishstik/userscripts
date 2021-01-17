// ==UserScript==
// @name         discord toggle channel list
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAADxElEQVRYR+1XS0wTaxT+ZoaWabVUQN6Uh4XY+ojv5C50YUJu7uIaY4wujGI06EqjIo2Jj5WPGAsYjRu8JsbHSu8z92rie2GMMVEjC2kJVKBY5FlTCp0+mBnzj3bo0NIO2qsuPJu285//nO//zjnfP6XwyTbdEJkyt/MIROwDkBN9nuZPLyicc5dZTt7cTPEkNhVNcLDReRSieDzNCROHo6hjTQ2WE0oAdscwgNyvAgAYabJZ504FIH6l5FKaJptVYn+yBHbHDwDTMlCcl4kVC42YY9DAMxhEq3MUOpZBppaW6AyGBYQjAtYsz0ZxHouedxxevPahbyg0bVVVlcCgz8CGmgIU5GrRPxyWEpYXsVLyROYfn0CXhwObSaMkn0WnO4C/HwzAH5iIc1cFYOuvxVhcbZA2M4zcLqp6NRIRoNHQeOUcxfX/+mYOwGjIwJHdVaBnljcukSACJy92wudXspCSgV9W56Hmp/TIwr2nw7jzhMjMpKUEcHiXGTlGjSq6Uzl5fRGc+s2lHgDp+vrtlXFxQ2EBbweCKC1g5QmIOo0FeAx6Qygr0iEjQb80X+lSTEVSBtasyMH6tfkKAFyQR/PVbrwfjSA7S4P62gp5Gobeh3H+eg+4EA9TIYs9W8rBTGmefx4N4vELrxwzKQDS/UstWQoAre1+XPvXIz/btq4ES+Z/nJCHz0Zw+/GQvLZ/W4XEUqxNnYakAAj9pAyxRk7ZeLkLvCBKp2vYUYm8bK3k0uEeR8uNXum7XsfgcJ1Z0oJYI6JEyhC1pACO76lOKDY9fRzaXGNYYJ6N8mKdIoHjzRjI+jJrFgpyleCJIynhsQsd6gDYGyzyLUX0meN46WQzMdIPWg0t9wKJY2t0qgNg21GpOAWhj5ywvEiHeSZ9UnFyv+Pg6g2gslSPihiWBkZCsF9WWQLDrAyQRjSb9DJiomgv23z46/4ASgtZ5OdooWcZ0DSFcY6H1xdGb38QRMBWLTIqRpEAInJM7gpVPUCciAJbzbOxcqFROgkpwaU/eqULJplVlelRt9GEQJBHt4fD89c+OFxjmHrVplTCmdT7c3x/APguGSDdpVSXzynu5J5+AMbpYsYx0GB3XBGB2i/LqdjtF2lhAyXQfwJQXiyJXssPnXYZJ5jw7wBq0gWCAtYKtOCjBPouAOmPyLQ6EF042NhuoUShMB0geIbuOFs/32M701YtUPQDQDSlBJCOxIliHGhuL6F54RaAJWQ9rgf+r8Sxcfee78jShCZuUsDP3wQAAbO75bnGMDqrpclm3Ul+fwCF65kwy+AsFwAAAABJRU5ErkJggg==
// @version      0.4
// @author       fishstik
// @include      https://discord.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-idle
// ==/UserScript==

const chanListSel     = '.sidebar-2K8pFh';   // channel list selector
const buttonParentSel = '.container-1r6BKw'; // chat header selector
const buttonId        = 'hide-sidebar';

GM_registerMenuCommand('Configure...', function() { 
  var showWidth = GM_getValue('showWidth') || '240';
  var hideWidth = GM_getValue('hideWidth') || '0';
  showWidth = window.prompt("Enter visible channel list width (Discord default: 240)", showWidth);
  if (showWidth !== null) {
    hideWidth = window.prompt("Enter hidden channel list width (0 to hide completely)", hideWidth);
    if (hideWidth !== null) {
      GM_setValue('showWidth', showWidth);
      GM_setValue('hideWidth', hideWidth);
    }
  }
});

(function($) {
  
  function toggleChannelList(hide) {
    const button = $(`#${buttonId}`);
    const chanList = $(chanListSel);
    const showWidth = parseInt(GM_getValue('showWidth') || '240');
    const hideWidth = parseInt(GM_getValue('hideWidth') || '0');
    
    if (hide) {
      chanList.width(hideWidth);
      
      // right-side icons in channel list entries
      GM_addStyle('.children-3rEycc, .children-L002ao { \
        visibility: hidden; \
        width: 0px; \
      }'); 
      GM_addStyle('.children-gzQq2t { visibility: hidden; }'); // X button in DMs
      GM_addStyle('.overflow-WK9Ogt { text-overflow: clip; }'); // channel list text overflow ellipses
      
      button.html('&#10095;');
      button.attr('title', `${hideWidth == 0 ? 'Show' : 'Expand'} channel list`);
      
      GM_setValue('hideOnLoad', true)
    } else {
      chanList.width(showWidth);
      
      // right-side icons in channel list entries
      GM_addStyle('.children-3rEycc, .children-L002ao { \
        visibility: visible; \
        width: initial; \
      }');
      GM_addStyle('.children-gzQq2t { visibility: visible; }'); // X button in DMs
      GM_addStyle('.overflow-WK9Ogt { text-overflow: ellipsis; }'); // channel list text overflow ellipses
      
      button.html('&#10094;');
      button.attr('title', `${hideWidth == 0 ? 'Hide' : 'Collapse'} channel list`);
      
      GM_setValue('hideOnLoad', false)
    }
  }
  
  function defineOnClick() {
    const chanList = $(chanListSel)
    $('#hide-sidebar').off('click'); // clear onclicks
    $('#hide-sidebar').on('click', function() {
      toggleChannelList(chanList.width() == parseInt(GM_getValue('showWidth') || '240'));
    });
  }
  
  function check(changes, observer) {
    if(!document.getElementById(buttonId) && document.querySelector(buttonParentSel)) {
      observer.disconnect();

      $(buttonParentSel).prepend(`<a id=${buttonId} title="Hide channel list">&#10094;</a>`);
      defineOnClick();
      
      GM_addStyle(`#${buttonId} {
        top: 10px;
        left: 0px;
        padding: 10px 5px;
        z-index: 1;
        color: var(--interactive-normal);
      }`);
      GM_addStyle(`#${buttonId}:hover { filter: contrast(200%); }`);

      toggleChannelList(GM_getValue('hideOnLoad', false));
      observer.observe(document, {childList: true, subtree: true});
    }
  }
  
  const observer = new MutationObserver(check);
  observer.observe(document, {childList: true, subtree: true});
  
})(jQuery);
