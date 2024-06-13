// contentScript.js
export {};
interface StorageChange {
	oldValue?: any;
	newValue?: any;
}

interface Changes {
	[key: string]: StorageChange;
}
let listenerAttached = false;
function addElementSelector(elementNumber: number) {
	if (listenerAttached) {
		return;
	}
	// Create a highlighter div
	const highlighter = document.createElement('div');
	highlighter.style.position = 'absolute';
	highlighter.style.border = '2px dashed red';
	highlighter.style.pointerEvents = 'none';
	highlighter.style.zIndex = '10000';
	document.body.appendChild(highlighter);

	function onMouseMove(event: { target: any }) {
		const target = event.target;
		const rect = target.getBoundingClientRect();
		highlighter.style.width = rect.width + 'px';
		highlighter.style.height = rect.height + 'px';
		highlighter.style.top = rect.top + 'px';
		highlighter.style.left = rect.left + 'px';
	}

	function onClick(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('click', onClick, true);
		document.body.removeChild(highlighter);

		const target = event.target as Element;
		const styles = window.getComputedStyle(target);
		const stylesObj: { [key: string]: string } = {};
		for (const element of styles) {
			stylesObj[element] = styles.getPropertyValue(element);
		}

		listenerAttached = false;
		chrome.runtime.sendMessage({
			action: 'setElemetSelected',
			styles: stylesObj,
			elementNumber: elementNumber,
		});
	}

	document.addEventListener('mousemove', onMouseMove);
	document.addEventListener('click', onClick, true);
	listenerAttached = true;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	console.info('CONTENT --> ', request);
	if (request.action === 'fetchStyles') {
		addElementSelector(request.elementNumber);
	}
});

chrome.storage.onChanged.addListener(
	(
		changes: { [key: string]: chrome.storage.StorageChange },
		namespace: string
	) => {
		if (namespace === 'local' && changes.activeExtension) {
			const activeExtension = changes.activeExtension.newValue;
			if (activeExtension) {
				// Si la extensión está activada, inyecta el botón "Select Element 1"
				let button = document.getElementById(
					'select-element-1'
				) as HTMLButtonElement;
				if (!button) {
					button = document.createElement('button');
					button.innerText = 'Select Element 1';
					button.id = 'select-element-1'; // Asegúrate de darle un ID único
					button.addEventListener('click', () => {
						// Lógica para seleccionar el primer elemento
					});
					document.body.appendChild(button);
				}
			} else {
				// Si la extensión está desactivada, remueve el botón "Select Element 1" si existe
				const existingButton = document.getElementById('select-element-1');
				if (existingButton) {
					existingButton.remove();
				}
			}
		}
	}
);
export {};
