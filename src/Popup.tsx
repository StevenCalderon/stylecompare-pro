// popup.tsx
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
	const [element1, setElement1] = useState<{ [key: string]: string } | null>(
		null
	);
	const [element2, setElement2] = useState<{ [key: string]: string } | null>(
		null
	);

	const selectElement = (elementNumber: number) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs[0].id !== undefined) {
				chrome.scripting.executeScript({
					target: { tabId: tabs[0].id },
					func: () => {
						chrome.runtime.sendMessage({ action: 'getElementStyles' });
					},
				});
				chrome.runtime.onMessage.addListener(
					(request, sender, sendResponse) => {
						if (request.styles) {
							if (elementNumber === 1) {
								setElement1(request.styles);
							} else {
								setElement2(request.styles);
							}
						}
					}
				);
			}
		});
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

		alert(
			differences.length > 0 ? differences.join('\n') : 'No differences found.'
		);
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
