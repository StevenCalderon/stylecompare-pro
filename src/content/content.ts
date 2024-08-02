import {
  BTN_ID,
  BTN_RESET_ID,
  BTN_RESET_STYLES,
  BTN_STYLES,
  COMPARE_LABEL,
  CONTAINER_STYLES,
  DIV_CONTAINER_ID,
  FIRST_LABEL,
  ICON_RESET_SVG,
  SECOND_LABEL,
} from '../common/constants/content.constants';
import { IStorage } from '../common/model/differences.model';
import { createElement } from '../common/utils/content.util';
import flowCompareStyles from './flows/flowCompareStyles/flowCompareStyles';
import flowSelectElement from './flows/flowSelectElement/flowSelectElement';

const handleButtonClick = (btn: HTMLButtonElement) => {
  const actions: { [key: string]: () => void | Promise<void> } = {
    'Select First Element': () =>
      flowSelectElement({ btn, keyStorage: 'elementFirstSelected', nextText: SECOND_LABEL }),
    'Select Second Element': () =>
      flowSelectElement({ btn, keyStorage: 'elementSecondSelected', nextText: COMPARE_LABEL }),
    'Compare Styles': async () => await flowCompareStyles(),
  };
  actions[btn.innerText]?.();
};

const resetStorage = () => {
  chrome.storage.local.set({
    storage: {
      elementFirstSelected: null,
      elementSecondSelected: null,
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
  const { elementFirstSelected, elementSecondSelected } = changes.storage.newValue;
  let text = FIRST_LABEL;
  if (elementFirstSelected && !elementSecondSelected) text = SECOND_LABEL;
  if (elementFirstSelected && elementSecondSelected) text = COMPARE_LABEL;
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
