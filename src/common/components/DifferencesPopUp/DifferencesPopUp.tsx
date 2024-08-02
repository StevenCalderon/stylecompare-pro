import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from '../../../reportWebVitals';
import { IElement, StylesType } from '../../model/differences.model';
import Card from '../Card/Card';
import { compareTwoStyles } from '../../utils/compare.util';

const DifferencesPopUp = () => {
  const [elements, setElements] = useState<{
    firstElement: IElement | null;
    secondElement: IElement | null;
  }>({ firstElement: null, secondElement: null });
  const [styleDiffs, setStylesDiffs] = useState<{
    firstStyle: StylesType | null;
    secondStyle: StylesType | null;
  }>({ firstStyle: null, secondStyle: null });

  useEffect(() => {
    chrome.storage.local.get(['storage']).then((result) => {
      const { elementFirstSelected, elementSecondSelected } = result.storage || {};
      const { diff1, diff2 } = compareTwoStyles(elementFirstSelected.styles, elementSecondSelected.styles);
      setStylesDiffs({ firstStyle: diff1, secondStyle: diff2 });
      setElements({ firstElement: elementFirstSelected, secondElement: elementSecondSelected });
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '1rem',
        flexDirection: 'row',
        backgroundColor: '#02263C',
        alignItems: 'center',
        padding: '5px',
      }}
    >
      {elements.firstElement && (
        <>
          <Card title={'First Element'} element={elements.firstElement} styleDiff={styleDiffs?.firstStyle} />
        </>
      )}
      {elements.secondElement && (
        <>
          <Card title={'Second Element'} element={elements.secondElement} styleDiff={styleDiffs?.secondStyle} />
        </>
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
