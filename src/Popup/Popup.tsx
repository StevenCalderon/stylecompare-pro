import { useEffect, useState } from "react";
import "./PopupStyle.css";

const Popup = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["storage"], (result) => {
      setIsActive(result.storage.activeExtension || false);
    });
  }, []);

  const resetStorage = () => {
    chrome.storage.local.set({
      storage: {
        elementFirstSelected: false,
        elementSecondSelected: false,
        activeExtension: true,
      },
    });
  };

  const changeCheckBox = (e: any) => {
    const checked = e.target.checked;
    setIsActive(checked);
    const oldStorage = chrome.storage.local.get("storage");
    oldStorage.then((result) => {
      chrome.storage.local.set({
        storage: {
          ...result.storage,
          activeExtension: checked,
        },
      });
    });
  };

  return (
    <div>
      <label className='switch'>
        <input type='checkbox' checked={isActive} onChange={changeCheckBox} />
        <span className='slider round'></span>
      </label>
      <button id='styleComparePro-btn-reset' onClick={resetStorage}>
        RESET
      </button>
    </div>
  );
};

export default Popup;
