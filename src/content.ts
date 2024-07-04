import { BTN_ID } from './constants/content.constants';

const createButton = (text: string, backgroundColor?: string) => {
	const btn = document.createElement('button');
	btn.innerText = text;
	btn.id = BTN_ID;
	btn.style.position = 'fixed';
	btn.style.top = '10px';
	btn.style.right = '10px';
	btn.style.zIndex = '99999999'; // Asegúrate de que el botón esté en un nivel superior
	btn.style.padding = '10px';
	btn.style.backgroundColor = backgroundColor ?? '#007bff';
	btn.style.color = 'white';
	btn.style.border = 'none';
	btn.style.borderRadius = '5px';
	btn.style.cursor = 'pointer';
	return btn;
};

const removeButton = () => {
	const existingButton = document.getElementById(BTN_ID);
	console.log('existingButton', existingButton);
	if (existingButton) existingButton.remove();
};

const handleFirstElementSelected = (button: HTMLButtonElement) => {
	console.log('handleFirstElementSelected');
	alert('Seleccionado Elemento 1');
	chrome.storage.local.set({
		storage: {
			activeExtension: true,
			firstElement: true,
			secondElement: false,
		},
	});
};

const handleSecondElementSelected = (button: HTMLButtonElement) => {
	console.log('handleSecondElementsSelected');
	alert('Seleccionado Elemento 2');
	chrome.storage.local.set({
		storage: {
			activeExtension: true,
			firstElement: true,
			secondElement: true,
		},
	});
};

const handleCompareStyles = () => {
	console.log('handleCompareStyles');
	alert('Estilos comparados');
};

const handleBtn = (button: HTMLButtonElement) => {
	chrome.storage.local.get(['storage']).then((changes) => {
		const { firstElement, secondElement } = changes.storage;
		const isStart = !firstElement && !secondElement;
		const isFirstElementSelected = firstElement && !secondElement;
		const isBothElementsSelected = firstElement && secondElement;
		switch (true) {
			case isStart: {
				handleFirstElementSelected(button);
				break;
			}
			case isFirstElementSelected: {
				handleSecondElementSelected(button);
				break;
			}
			case isBothElementsSelected: {
				handleCompareStyles();
				break;
			}
			default:
				break;
		}
	});
};

const handleActiveExtension = (changes: {
	[key: string]: chrome.storage.StorageChange;
}) => {
	console.log('handleActiveExtension', changes);
	let button = document.getElementById(BTN_ID) as HTMLButtonElement;

	if (!button) {
		button = createButton('Select first element');
		button.addEventListener('click', (e) => {
			e.preventDefault();
			handleBtn(button);
		});
		document.body.appendChild(button);
	} else {
		const { firstElement, secondElement } = changes.storage.newValue;
		const isStart = !firstElement && !secondElement;
		const isFirstElementSelected = firstElement && !secondElement;
		const isBothElementsSelected = firstElement && secondElement;
		switch (true) {
			case isStart: {
				button.innerText = 'Select first element';
				break;
			}
			case isFirstElementSelected: {
				button.innerText = 'Select Second element';
				break;
			}
			case isBothElementsSelected: {
				button.innerText = 'Compare Styles!';
				break;
			}
			default:
				break;
		}
	}
};

chrome.storage.onChanged.addListener(
	(
		changes: { [key: string]: chrome.storage.StorageChange },
		namespace: string
	) => {
		console.log('CHANGES ', changes, 'Namespace ', namespace);

		chrome.storage.local.get(['storage']).then((value) => {
			console.log('valueStorage ', value);
			const activeExtension = value.storage.activeExtension;

			console.log('activeExtension ', activeExtension);
			if (namespace !== 'local') return;
			if (!activeExtension) {
				removeButton();
				return;
			}
			handleActiveExtension(changes);
		});
	}
);
export {};
