import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from '../../../reportWebVitals';

export type DifferencesType = {
  [key: string]: { style1: string; style2: string };
};

const DifferencesPopUp = () => {
  const [differences, setDifferences] = useState<DifferencesType>({});

  useEffect(() => {
    chrome.storage.local.get('differences', (result) => {
      if (result.differences) {
        setDifferences(result.differences);
      }
    });
  }, []);

  return (
    <div>
      <h3>Differences in Styles</h3>
      <div id="differences">
        {Object.keys(differences).map((key) => (
          <p key={key}>
            <strong>{key}:</strong> Element 1: <code>{differences[key].style1}</code> | Element 2:{' '}
            <code>{differences[key].style2}</code>
          </p>
        ))}
      </div>
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
