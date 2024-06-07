import { useState } from 'react';

const Popup = () => {
  const [element1, setElement1] = useState<{ [key: string]: string } | null>(null);
  const [element2, setElement2] = useState<{ [key: string]: string } | null>(null);

  const selectElement = async (elementNumber: number) => {
    console.log('elementNumber:', elementNumber);
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      console.log('Tab:', tab);
      if (tab.id !== undefined) {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () => {
            chrome.runtime.sendMessage({ action: 'selectElement' });
          },
        });
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
          console.log('Received message:', request);
          if (request.action === 'elementSelected' && request.styles) {
            if (elementNumber === 1) {
              setElement1(request.styles);
            } else {
              setElement2(request.styles);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error querying tabs:', error);
    }
  };

  const compareStyles = () => {
    if (!element1 || !element2) {
      alert('Please select both elements first.');
      return;
    }

    const differences: string[] = [];
    for (let style in element1) {
      if (element1[style] !== element2[style]) {
        differences.push(`${style}: ${element1[style]} != ${element2[style]}`);
      }
    }

    alert(differences.length > 0 ? differences.join('\n') : 'No differences found.');
  };

  return (
    <div>
      <button onClick={() => selectElement(1)}>Select Element 1</button>
      <button onClick={() => selectElement(2)}>Select Element 2</button>
      <button onClick={compareStyles}>Compare Styles</button>
    </div>
  );
};

export default Popup;
