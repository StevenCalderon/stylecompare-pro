import { createElement } from './common/utils/content.util';
import {
  BTN_ID,
  BTN_RESET_ID,
  BTN_RESET_STYLES,
  BTN_STYLES,
  CONTAINER_STYLES,
  DIV_CONTAINER_ID,
  ICON_RESET_SVG,
} from './constants/content.constants';

const updateStorage = async (key: string, value: any) => {
  const oldStorage = await chrome.storage.local.get('storage');
  await chrome.storage.local.set({
    storage: { ...oldStorage.storage, [key]: value },
  });
};

const selectElement = async (btn: HTMLButtonElement, key: string, nextText: string) => {
  alert(`Seleccionado ${key === 'elementFirstSelected' ? 'Elemento 1' : 'Elemento 2'}`);
  await updateStorage(key, true);
  btn.innerText = nextText;
};

const handleButtonClick = (btn: HTMLButtonElement) => {
  const actions: { [key: string]: () => void } = {
    'Select Element 1': () => selectElement(btn, 'elementFirstSelected', 'Select Element 2'),
    'Select Element 2': () => selectElement(btn, 'elementSecondSelected', 'Compare Styles'),
    'Compare Styles': () => alert('Comparando estilos'),
  };
  actions[btn.innerText]?.();
};

const resetStorage = () => {
  console.log('Reset Storage');
  chrome.storage.local.set({
    storage: {
      elementFirstSelected: false,
      elementSecondSelected: false,
      activeExtension: true,
    },
  });
};

const handleActiveExtension = async (changes: { [key: string]: chrome.storage.StorageChange }) => {
  let button = document.getElementById(BTN_ID) as HTMLButtonElement;
  let btnReset = document.getElementById(BTN_RESET_ID) as HTMLButtonElement;
  let divContainer = document.getElementById(DIV_CONTAINER_ID) as HTMLElement;

  if (!divContainer) {
    divContainer = createElement('div', DIV_CONTAINER_ID, CONTAINER_STYLES) as HTMLElement;
    divContainer.classList.add(DIV_CONTAINER_ID);
    document.body.appendChild(divContainer);
  }

  if (!btnReset) {
    btnReset = createElement('button', BTN_RESET_ID, BTN_RESET_STYLES) as HTMLButtonElement;
    btnReset.innerHTML = ICON_RESET_SVG;
    btnReset.addEventListener('click', () => resetStorage());
    divContainer.appendChild(btnReset);
  }

  if (!button) {
    button = createElement('button', BTN_ID, BTN_STYLES) as HTMLButtonElement;
    button.addEventListener('click', () => handleButtonClick(button));
    divContainer.appendChild(button);
  }

  const { elementFirstSelected, elementSecondSelected } = changes.storage.newValue;
  let text = 'Select Element 1';
  if (elementFirstSelected && !elementSecondSelected) text = 'Select Element 2';
  if (elementFirstSelected && elementSecondSelected) text = 'Compare Styles';
  button.innerText = text;
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('Cambio detectado en el listenining ', changes, namespace, changes.storage.newValue.activeExtension);
  if (namespace !== 'local' || changes.storage?.newValue?.activeExtension === undefined) return;

  if (changes.storage.newValue.activeExtension) {
    handleActiveExtension(changes);
  } else {
    const divs = document.getElementsByClassName(DIV_CONTAINER_ID);
    if (divs.length <= 0) return;
    Array.from(divs).forEach((div) => div.remove());
  }
});

export {};
