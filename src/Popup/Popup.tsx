import { useEffect, useState } from 'react';
import './PopupStyle.css';

const Popup = () => {
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		chrome.storage.local.get(['storage'], (result) => {
			setIsActive(result.storage.activeExtension || false);
		});
	}, []);

	const changeCheckBox = (e: any) => {
		const checked = e.target.checked;
		setIsActive(checked);
		chrome.storage.local.set({
			storage: {
				activeExtension: checked,
				firstElement: false,
				secondElement: false,
			},
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
