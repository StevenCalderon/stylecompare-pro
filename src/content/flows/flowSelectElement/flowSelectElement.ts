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

  for (const element of computedStyles) {
    const key = element;
    styles[key] = computedStyles.getPropertyValue(key);
  }

  return styles;
};

const getElementHtmlAndStyles = (element: HTMLElement) => {
  const captureStylesRecursively = (el: HTMLElement) => {
    const elementWithStyles = {
      html: el.outerHTML,
      styles: getElementStyles(el),
      children: [] as any[],
    };

    for (const child of Array.from(el.children)) {
      elementWithStyles.children.push(captureStylesRecursively(child as HTMLElement));
    }

    return elementWithStyles;
  };

  return captureStylesRecursively(element);
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
      target.addEventListener('click', handleClick);
    }
  };

  const handleClick = async (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.id !== BTN_ID) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      document.body.removeChild(overlay);
      document.removeEventListener('mouseover', handleMouseOver);
      target.removeEventListener('click', handleClick);
      selectElement(btn, keyStorage, nextText, target);
    }
  };

  document.addEventListener('mouseover', handleMouseOver);
};

export default flowSelectElement;
