const flowCompareStyles = async () => {
  const storage = await chrome.storage.local.get('storage');
  const { elementFirstSelected, elementSecondSelected } = storage.storage || {};
  if (!elementFirstSelected || !elementSecondSelected) {
    alert('You must select both items before comparing.');
    return;
  }
  chrome.runtime.sendMessage({ action: 'displayDifferences' });
};
export default flowCompareStyles;
