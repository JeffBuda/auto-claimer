/** start/stop context menu */
var contextMenu;

/** state from the content script */
var state = { polling: undefined, secondsRemaining: undefined };

function contextMenuTitle(details) {
  return chrome.i18n.getMessage('pollForClaimButton') + ` (${details})`;
}

function updatePollingMenuItem() {
  chrome.contextMenus.update(
    'pollForClaimButton',
    {
      checked: state.polling,
      title: contextMenuTitle(state.polling ? `polling (in ${state.secondsRemaining})...` : `not polling`)
    });
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (!sender.tab) {
      // message is from browser
      // inject the content script to get the selection in the context of the activetab
      chrome.tabs.executeScript({
        file: 'contentScript.js'
      });
    }
  });

/** Add the context menu item once */
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'pollForClaimButton',
    type: 'checkbox',
    checked: false,
    title: chrome.i18n.getMessage('pollForClaimButton'),
    contexts: ['browser_action'],
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    state.polling = info.checked;
    state.tabId = tabs[0].id;
    updatePollingMenuItem();
  });
});

(() => {
  // start main loop
  state.secondsRemaining = 30;

  setInterval(() => {
    if (state.polling) {
      if (state.secondsRemaining > 0) {
        state.secondsRemaining = state.secondsRemaining - 1;
      } else {
        state.secondsRemaining = 30;

        const results = chrome.tabs.executeScript(
          state.tabId,
          {
            file: 'contentScript.js'
          },
          results => {
            // content script returns true if the Claim button was clicked
            if (results && results[0] === true) {
              state.polling = false; // uncheck the menu item if we clicked Claim 
              updatePollingMenuItem();
            }
          });
      }
      updatePollingMenuItem();
    }
  }, 1000);
})();


