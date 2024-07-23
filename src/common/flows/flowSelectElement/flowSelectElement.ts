import { BTN_ID } from '../../../constants/content.constants';
import { IStorage } from '../../../content';

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

const selectElement = async (btn: HTMLButtonElement, key: string, nextText: string, element?: HTMLElement) => {
  await updateStorage(key, { selected: true, styles: element ? getComputedStyles(element) : '' });
  btn.innerText = nextText;
};

const getComputedStyles = (element: HTMLElement): { [key: string]: string } => {
  const styles: { [key: string]: string } = {};
  const computedStyles = window.getComputedStyle(element);
  for (const style in computedStyles) {
    const property = style;
    styles[property] = computedStyles.getPropertyValue(property);
  }
  return styles;
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

  const handleClick = (event: MouseEvent) => {
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
