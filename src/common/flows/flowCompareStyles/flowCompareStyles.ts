const displayDifferences = (differences: { [key: string]: { style1: string; style2: string } }) => {
  const resultDiv = document.createElement('div');
  resultDiv.id = 'style-comparison-results';
  resultDiv.style.position = 'fixed';
  resultDiv.style.top = '10px';
  resultDiv.style.left = '10px';
  resultDiv.style.backgroundColor = 'white';
  resultDiv.style.border = '1px solid #ccc';
  resultDiv.style.padding = '10px';
  resultDiv.style.zIndex = '10000';
  document.body.appendChild(resultDiv);

  const header = document.createElement('h3');
  header.innerText = 'Differences in Styles';
  resultDiv.appendChild(header);

  for (const key in differences) {
    if (differences.hasOwnProperty(key)) {
      const { style1, style2 } = differences[key];
      const p = document.createElement('p');
      p.innerHTML = `<strong>${key}:</strong> Element 1: <code>${style1}</code> | Element 2: <code>${style2}</code>`;
      resultDiv.appendChild(p);
    }
  }
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

  displayDifferences(differences);
};
export default flowCompareStyles;
