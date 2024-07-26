import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from '../../../reportWebVitals';
import { compareTwoStyles } from '../../utils/compare.util';
import Card from '../Card/Card';
import { ICardDifferences } from '../../model/differences.model';
export type DifferencesType = {
  [key: string]: { style1: string; style2: string };
};

const buildDataForCard = (title: string, element: HTMLElement, diff: { [key: string]: { style1: string } }) => {
  return {
    title,
    element: element,
    differences: diff,
  };
};

const DifferencesPopUp = () => {
  const [firstCard, setFirstCard] = useState<ICardDifferences | null>(null);
  const [secondCard, setSecondCard] = useState<ICardDifferences | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['storage']).then((result) => {
      const { elementFirstSelected, elementSecondSelected } = result.storage || {};

      const _differences = compareTwoStyles(elementFirstSelected?.style, elementSecondSelected?.style);
      if (_differences && Object.keys(_differences).length > 0) {
        setFirstCard(buildDataForCard('First Element', elementFirstSelected, _differences));
        setSecondCard(buildDataForCard('Second Element', elementSecondSelected, _differences));
      }
    });
  }, []);

  return (
    <div>
      <h3>Differences in Styles</h3>
      {firstCard && secondCard ? (
        <>
          <Card {...firstCard} />
          <Card {...secondCard} />
        </>
      ) : (
        <p>No differences</p>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <DifferencesPopUp />
  </React.StrictMode>
);

reportWebVitals();
