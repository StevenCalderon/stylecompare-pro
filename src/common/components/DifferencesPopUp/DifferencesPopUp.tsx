import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from '../../../reportWebVitals';
import { IElements, IStorage, StylesType } from '../../model/differences.model';
import { compareTwoStyles } from '../../utils/compare.util';
import Card from '../Card/Card';
const resetStorage = () => {
  chrome.storage.local.set({
    storage: {
      elementFirstSelected: null,
      elementSecondSelected: null,
      activeExtension: true,
    } as IStorage,
  });
};
const DifferencesPopUp = () => {
  const [elements, setElements] = useState<{
    firstElement: IElements | null;
    secondElement: IElements | null;
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
      resetStorage();
    });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        flexDirection: 'row',
        backgroundColor: '#f7f8ff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px',
        height: 'calc(100% - 1.3rem)',
      }}
    >
      {elements.firstElement && (
        <Card title={'First Element'} element={elements.firstElement} styleDiff={styleDiffs?.firstStyle} />
      )}
      {elements.secondElement && (
        <Card title={'Second Element'} element={elements.secondElement} styleDiff={styleDiffs?.secondStyle} />
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
