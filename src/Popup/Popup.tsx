import { useEffect, useState } from 'react';
import './PopupStyle.css';
import { IStorage } from '../common/constants/content.constants';

const Popup = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['storage'], (result) => {
      const storage = result.storage || { activeExtension: false };
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
          elementFirstSelected: null,
          elementSecondSelected: null,
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
