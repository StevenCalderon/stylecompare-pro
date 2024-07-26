const flowCompareStyles = async () => {
  const storage = await chrome.storage.local.get('storage');
  const { elementFirstSelected, elementSecondSelected } = storage.storage || {};

  if (!elementFirstSelected || !elementSecondSelected) {
    alert('You must select both items before comparing.');
    return;
  }

  await chrome.storage.local.set({ elementFirstSelected, elementSecondSelected });
  chrome.runtime.sendMessage({ action: 'displayDifferences' });
};
export default flowCompareStyles;
