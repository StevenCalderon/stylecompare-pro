// content.ts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'getElementStyles') {
		document.addEventListener(
			'click',
			function handleClick(event) {
				event.preventDefault();
				const element = event.target as HTMLElement;
				const styles = window.getComputedStyle(element);
				const styleObj: { [key: string]: string } = {};
				for (let i = 0; i < styles.length; i++) {
					styleObj[styles[i]] = styles.getPropertyValue(styles[i]);
				}
				sendResponse({ styles: styleObj });
				document.removeEventListener('click', handleClick, true);
			},
			{ once: true, capture: true }
		);
		return true;
	}
});

