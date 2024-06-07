// background.js
export {};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('request:', request);
  if (request.action === "getElementStyles" && sender?.tab?.id) {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      func: () => {
        chrome.runtime.sendMessage({ action: "elementSelected" });
      },
    });
  }
});
