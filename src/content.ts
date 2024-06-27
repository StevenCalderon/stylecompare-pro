// contentScript.js

chrome.storage.onChanged.addListener(
	(
		changes: { [key: string]: chrome.storage.StorageChange },
		namespace: string
	) => {
		console.log('content -->', changes, namespace);
		if (namespace === 'local' && changes.activeExtension) {
			const activeExtension = changes.activeExtension.newValue;
			if (activeExtension) {
				// Si la extensión está activada, inyecta el botón "Select Element 1"
				let button = document.getElementById(
					'styleComparePro-select-element-1'
				) as HTMLButtonElement;
				if (!button) {
					button = document.createElement('button');
					button.innerText = 'Select Element 1';
					button.id = 'styleComparePro-select-element-1'; // Asegúrate de darle un ID único
					button.style.position = 'fixed';
					button.style.top = '10px';
					button.style.right = '10px';
					button.style.zIndex = '10000'; // Asegúrate de que el botón esté en un nivel superior
					button.style.padding = '10px';
					button.style.backgroundColor = '#007bff';
					button.style.color = 'white';
					button.style.border = 'none';
					button.style.borderRadius = '5px';
					button.style.cursor = 'pointer';
					let element1Selected = false;
					button.addEventListener('click', () => {
						if (!element1Selected) {
							// Lógica para seleccionar el primer elemento
							alert('Seleccionado Elemento 1');
							element1Selected = true;
							button.innerText = 'Select Element 2';
						} else {
							// Lógica para seleccionar el segundo elemento
							alert('Seleccionado Elemento 2');
							// Lógica adicional para comparar estilos
						}
					});
					document.body.appendChild(button);
				}
			} else {
				// Si la extensión está desactivada, remueve el botón "Select Element 1" si existe
				const existingButton = document.getElementById(
					'styleComparePro-select-element-1'
				);
				if (existingButton) {
					existingButton.remove();
				}
			}
		}
	}
);
export {};
