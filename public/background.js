// background.ts
chrome.runtime.onInstalled.addListener(() => {
	console.log('CSS Style Comparator installed.');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'saveElement') {
		chrome.storage.local.set({ [request.key]: request.data }, () => {
			sendResponse({ status: 'success' });
		});
		return true;
	}
});
