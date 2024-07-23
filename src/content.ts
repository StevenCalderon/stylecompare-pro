import flowCompareStyles from './common/flows/flowCompareStyles/flowCompareStyles';
import flowSelectElement from './common/flows/flowSelectElement/flowSelectElement';
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

export interface IStorage {
  elementFirstSelected: { selected: boolean; styles: string };
  elementSecondSelected: { selected: boolean; styles: string };
  activeExtension: boolean;
}
const handleButtonClick = (btn: HTMLButtonElement) => {
  const actions: { [key: string]: () => void } = {
    'Select Element 1': () =>
      flowSelectElement({ btn, keyStorage: 'elementFirstSelected', nextText: 'Select Element 2' }),
    'Select Element 2': () =>
      flowSelectElement({ btn, keyStorage: 'elementSecondSelected', nextText: 'Compare Styles' }),
    'Compare Styles': async () => await flowCompareStyles(),
  };
  actions[btn.innerText]?.();
};

const resetStorage = () => {
  console.log('Reset Storage');
  chrome.storage.local.set({
    storage: {
      elementFirstSelected: { selected: false, styles: '' },
      elementSecondSelected: { selected: false, styles: '' },
      activeExtension: true,
    } as IStorage,
  });
};

const handleActiveExtension = async (changes: { [key: string]: chrome.storage.StorageChange }) => {
  let button = document.getElementById(BTN_ID) as HTMLButtonElement;
  let btnReset = document.getElementById(BTN_RESET_ID) as HTMLButtonElement;
  let divContainer = document.getElementById(DIV_CONTAINER_ID) as HTMLElement;

  if (!divContainer) {
    divContainer = createElement('div', DIV_CONTAINER_ID, CONTAINER_STYLES);
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
  console.log('🚀 ~ handleActiveExtension ~ changes.storage.newValue:', changes.storage.newValue);
  const { elementFirstSelected, elementSecondSelected } = changes.storage.newValue;
  let text = 'Select Element 1';
  if (elementFirstSelected.selected && !elementSecondSelected.selected) text = 'Select Element 2';
  if (elementFirstSelected.selected && elementSecondSelected.selected) text = 'Compare Styles';
  button.innerText = text;
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace !== 'local' || changes.storage?.newValue?.activeExtension === undefined) return;

  if (changes.storage.newValue.activeExtension) {
    handleActiveExtension(changes);
  } else {
    const divs = document.getElementsByClassName(DIV_CONTAINER_ID);
    Array.from(divs).forEach((div) => div.remove());
  }
});

export {};
