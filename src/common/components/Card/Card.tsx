import DOMPurify from 'dompurify';
import { IElement, StylesType } from '../../model/differences.model';
import './Card.styles.css';
export interface IProps {
  title: string;
  element: IElement;
  styleDiff: StylesType | null;
}

const sanitizedData = (data: string) => DOMPurify.sanitize(data);

const Card = (data: IProps) => {
  const { title, element, styleDiff } = data;
  const copyStyles = () => {
    const textToCopy = JSON.stringify(styleDiff);
    navigator.clipboard.writeText(textToCopy);
  };

  const createStyledElement = (elementData: IElement) => {
    const element = document.createElement('div');
    element.innerHTML = sanitizedData(elementData.html);

    const styledElement = element.firstChild as HTMLElement;
    Object.entries(elementData.styles).forEach(([key, value]) => {
      styledElement.style.setProperty(key, value);
    });

    return styledElement;
  };

  return (
    <div className="container-card">
      <div className="header">
        <h2>{title}</h2>
      </div>
      <div className="content">
        <div className="content-element">
          <div ref={(el) => el && el.appendChild(createStyledElement(element))}> </div>
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
          Copy!
        </button>
      </div>
    </div>
  );
};

export default Card;
