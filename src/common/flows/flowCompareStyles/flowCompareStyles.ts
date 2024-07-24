const displayDifferences = async (differences: { [key: string]: { style1: string; style2: string } }) => {
  await chrome.storage.local.set({ differences });
  chrome.runtime.sendMessage({ action: 'displayDifferences', differences });
};

const compareTwoStyles = (styles1: { [key: string]: string }, styles2: { [key: string]: string }) => {
  const differences: { [key: string]: { style1: string; style2: string } } = {};
  for (const key in styles1) {
    if (styles1.hasOwnProperty(key)) {
      if (styles2[key] !== styles1[key]) {
        differences[key] = { style1: styles1[key], style2: styles2[key] };
      }
    }
  }

  for (const key in styles2) {
    if (styles2.hasOwnProperty(key) && !styles1.hasOwnProperty(key)) {
      differences[key] = { style1: 'Not Set', style2: styles2[key] };
    }
  }
  return differences;
};

const flowCompareStyles = async () => {
  const storage = await chrome.storage.local.get('storage');
  const { elementFirstSelected, elementSecondSelected } = storage.storage || {};

  if (!elementFirstSelected || !elementSecondSelected) {
    alert('Debes seleccionar ambos elementos antes de comparar.');
    return;
  }

  const styles1 = elementFirstSelected.styles;
  const styles2 = elementSecondSelected.styles;
  const differences = compareTwoStyles(styles1, styles2);

  await displayDifferences(differences);
};
export default flowCompareStyles;
