import {
  BTN_ID,
  BTN_RESET_ID,
  BTN_RESET_STYLES,
  BTN_STYLES,
  CONTAINER_STYLES,
  DIV_CONTAINER_ID,
} from './constants/content.constants';

const createBtn = (id: string, styles: any): HTMLButtonElement => {
  const btn = document.createElement('button');
  btn.id = id;
  Object.assign(btn.style, styles);
  return btn;
};

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
  console.log('handleActiveExtension btn->', button, changes);
  if (!button) {
    const divContainer = document.createElement('div');
    divContainer.id = DIV_CONTAINER_ID;
    Object.assign(divContainer.style, CONTAINER_STYLES);

    button = createBtn(BTN_ID, BTN_STYLES);
    button.innerText = 'Select Element 1';
    await updateStorage('elementFirstSelected', false);
    button.addEventListener('click', () => handleButtonClick(button));

    const btnReset = createBtn(BTN_RESET_ID, BTN_RESET_STYLES);
    btnReset.innerText = 'Reset';
    btnReset.addEventListener('click', () => resetStorage());
    divContainer.appendChild(btnReset);
    divContainer.appendChild(button);
    document.body.appendChild(divContainer);
  } else {
    const { elementFirstSelected, elementSecondSelected } = changes.storage.newValue;
    let text = 'Select Element 1';
    if (elementFirstSelected && !elementSecondSelected) text = 'Select Element 2';
    if (elementFirstSelected && elementSecondSelected) text = 'Compare Styles';
    button.innerText = text;
  }
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log('Cambio detectado en el listenining ', changes, namespace, changes.storage.newValue.activeExtension);
  if (namespace !== 'local' || changes.storage?.newValue?.activeExtension === undefined) return;

  if (changes.storage.newValue.activeExtension) {
    handleActiveExtension(changes);
  } else {
    document.getElementById(DIV_CONTAINER_ID)?.remove();
  }
});

export {};
