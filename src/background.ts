chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.info('BACKGROUND --> ', request);
  if (request.action === 'selectElement') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: 'fetchStyles', selector: request.selector, elementNumber: request.elementNumber },
          (response) => {
            // Optional: Handl the response from content.js if needed
            sendResponse(response);
          }
        );
      }
    });
    //elementSelected return true; // Required to use sendResponse asynchronously
  }

  if (request.action === 'setElemetSelected') {
    chrome.runtime.sendMessage({ action: 'setElemetSelected', elementNumber: request.elementNumber });
  }

  if (request.action === 'displayDifferences') {
    chrome.windows.create({
      url: `differencesPopUp.html`,
      type: 'popup',
      width: 600,
      height: 400,
      focused: true,
    });
  }
});
export {};
