import { ICardDifferences } from '../../model/differences.model';
import './Card.styles.css';

const Card = (data: ICardDifferences) => {
  const copyStyles = () => {
    const textToCopy = JSON.stringify(data.differences);
    navigator.clipboard.writeText(textToCopy);
  };
  return (
    <div className="container-card">
      <div className="header">
        <h2>{data.title}</h2>
      </div>
      <div className="content">
        <div className="content-element">
          <div dangerouslySetInnerHTML={{ __html: data.element.outerHTML }} />
        </div>
        <div className="content-diff">
          {Object.keys(data.differences).map((key) => (
            <p key={key}>
              <strong>{key}:</strong> <code>{data.differences[key].style1}</code>
            </p>
          ))}
        </div>
      </div>
      <div className="footer">
        <button className="btn btn-primary" onClick={() => copyStyles()}>
          Copy!
        </button>
      </div>
    </div>
  );
};

export default Card;
