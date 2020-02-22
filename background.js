/**
 * Listen for messages from the injected script and the context menu item
 */
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (sender.tab) {
      // message is from contentScript.js
      // get the selection from the content script
      request.urls.forEach(url => {
        chrome.tabs.create({ url: url });
      });

    } else {
      // message is from browser
      // inject the content script to get the selection in the context of the activetab
      chrome.tabs.executeScript({
        file: 'contentScript.js'
      });
    }
  });

  

/**
 * Add the context menu item once
 */
chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
    id: 'openSelectedInNewTabs',
    title: chrome.i18n.getMessage('openSelectedInNewTabs'),
    contexts: ['selection', 'browser_action'],
  });
});

/**
 * When clicked, inject a script into the active tab to get the selected URLs
 */
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.executeScript({
    file: 'contentScript.js'
  });
});

