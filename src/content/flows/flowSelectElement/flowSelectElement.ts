import { BTN_ID } from '../../../common/constants/content.constants';
import { IStorage } from '../../../common/model/differences.model';

export interface IFlowSelectElement {
  btn: HTMLButtonElement;
  keyStorage: string;
  nextText: string;
}

const createOverlay = () => {
  const overlay = document.createElement('div');
  overlay.id = 'element-selector-overlay';
  overlay.style.position = 'absolute';
  overlay.style.backgroundColor = 'rgba(0, 123, 255, 0.5)';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = '9999';
  document.body.appendChild(overlay);
  return overlay;
};

const highlightElement = (element: HTMLElement, overlay: HTMLDivElement) => {
  const rect = element.getBoundingClientRect();
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.top = `${rect.top + window.scrollY}px`;
  overlay.style.left = `${rect.left + window.scrollX}px`;
};

const updateStorage = async (key: string, value: any) => {
  const oldStorage = await chrome.storage.local.get('storage');
  await chrome.storage.local.set({
    storage: { ...oldStorage.storage, [key]: value } as IStorage,
  });
};

const getElementStyles = (element: HTMLElement) => {
  const computedStyles = window.getComputedStyle(element);
  const styles: { [key: string]: string } = {};

  for (let i = 0; i < computedStyles.length; i++) {
    const key = computedStyles[i];
    styles[key] = computedStyles.getPropertyValue(key);
  }

  return styles;
};

const getElementHtmlAndStyles = (element: HTMLElement) => {
  const html = element.outerHTML;
  const styles = getElementStyles(element);
  return { html, styles };
};

const selectElement = async (btn: HTMLButtonElement, key: string, nextText: string, element: HTMLElement) => {
  const elementData = getElementHtmlAndStyles(element);
  await updateStorage(key, elementData);
  btn.innerText = nextText;
};

const flowSelectElement = (props: IFlowSelectElement) => {
  const { btn, keyStorage, nextText } = props;
  const overlay = createOverlay();
  const handleMouseOver = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.id !== BTN_ID) {
      highlightElement(target, overlay);
    }
  };

  const handleClick = async (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.id !== BTN_ID) {
      event.preventDefault();
      event.stopPropagation();
      document.body.removeChild(overlay);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
      selectElement(btn, keyStorage, nextText, target);
    }
  };

  document.addEventListener('mouseover', handleMouseOver);
  document.addEventListener('click', handleClick);
};

export default flowSelectElement;
