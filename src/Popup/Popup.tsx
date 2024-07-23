import { useEffect, useState } from 'react';
import { IStorage } from '../content';
import './PopupStyle.css';

const Popup = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['storage'], (result) => {
      const storage = result.storage || { activeExtension: false }; // Valor predeterminado si no existe
      setIsActive(storage.activeExtension);
    });
  }, []);

  const changeCheckBox = (e: any) => {
    const checked = e.target.checked;
    setIsActive(checked);
    const oldStorage = chrome.storage.local.get('storage');
    oldStorage.then((result) => {
      chrome.storage.local.set({
        storage: {
          activeExtension: checked,
          elementFirstSelected: { selected: false, styles: '' },
          elementSecondSelected: { selected: false, styles: '' },
        } as IStorage,
      });
    });
  };

  return (
    <div>
      <label className="switch">
        <input type="checkbox" checked={isActive} onChange={changeCheckBox} />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default Popup;
