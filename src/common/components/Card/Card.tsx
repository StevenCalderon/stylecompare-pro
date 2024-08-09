import DOMPurify from 'dompurify';
import { IElements, StylesType } from '../../model/differences.model';
import './Card.styles.css';
export interface IProps {
  title: string;
  element: IElements;
  styleDiff: StylesType | null;
}

const sanitizedData = (data: string) => DOMPurify.sanitize(data);

const applyStyles = (element: HTMLElement, styles: { [key: string]: string }) => {
  for (const [key, value] of Object.entries(styles)) {
    element.style.setProperty(key, value);
  }
};

const createElementWithStylesRecursively = (element: HTMLElement, childrenData: any[]) => {
  childrenData.forEach((childData, index) => {
    const childElement = element.children[index] as HTMLElement;
    applyStyles(childElement, childData.styles);
    if (childData.children.length > 0) {
      createElementWithStylesRecursively(childElement, childData.children);
    }
  });
};

const createElementWithStyles = (elementData: any) => {
  const tempContainer = document.createElement('div');
  tempContainer;
  tempContainer.innerHTML = elementData.html;
  const element = tempContainer.firstElementChild as HTMLElement;

  applyStyles(element, elementData.styles);

  elementData.children.forEach((childData: any, index: number) => {
    const childElement = element.children[index] as HTMLElement;
    applyStyles(childElement, childData.styles);
    createElementWithStylesRecursively(childElement, childData.children);
  });

  return element;
};

const Card = (data: IProps) => {
  const { title, element, styleDiff } = data;
  const copyStyles = () => {
    const textToCopy = JSON.stringify(styleDiff);
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="container-card">
      <div className="header">
        <h2>{title}</h2>
      </div>
      <div className="content">
        <div className="content-element">
          <div
            style={{ width: '100%', height: '100%' }}
            ref={(el) => {
              if (el) el.appendChild(createElementWithStyles(element));
            }}
          >
            {' '}
          </div>
        </div>
        <div className="content-diff">
          {styleDiff ? (
            Object.keys(styleDiff).map((key) => (
              <p key={key}>
                <strong>{key}:</strong> <code>{styleDiff[key]}</code>
              </p>
            ))
          ) : (
            <strong>There are no different styles </strong>
          )}
        </div>
      </div>
      <div className="footer">
        <button className="btn btn-copy" onClick={() => copyStyles()}>
          Copy Styles!
        </button>
      </div>
    </div>
  );
};

export default Card;
