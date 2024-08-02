export const BTN_ID = 'sdcc-styleComparePro-select-element';
export const BTN_RESET_ID = 'sdcc-styleComparePro-reset-element';
export const DIV_CONTAINER_ID = 'sdcc-styleComparePro-container-element';

export const CONTAINER_STYLES = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  zIndex: '10000',
  padding: '10px',
  backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fondo semitransparente para mayor visibilidad
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '1rem',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', // Añade una sombra para resaltar el contenedor
};

export const BTN_STYLES = {
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  hover: {
    backgroundColor: '#054BB3',
  },
};

export const BTN_RESET_STYLES = {
  padding: '5px',
  backgroundColor: '#f8f9fa',
  color: 'white',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background-color 0.3s ease',
  hover: {
    backgroundColor: '#e2e6ea',
  },
};

export const ICON_RESET_SVG = `
<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="auto"><path d="M12,0c-2.991,0-5.813,1.113-8,3.078V1c0-.553-.448-1-1-1s-1,.447-1,1V5c0,1.103,.897,2,2,2h4c.552,0,1-.447,1-1s-.448-1-1-1h-3.13c1.876-1.913,4.422-3,7.13-3,5.514,0,10,4.486,10,10s-4.486,10-10,10c-5.21,0-9.492-3.908-9.959-9.09-.049-.55-.526-.956-1.086-.906C.405,12.054,0,12.54,.049,13.09c.561,6.22,5.699,10.91,11.951,10.91,6.617,0,12-5.383,12-12S18.617,0,12,0Z"/></svg>
`;

export const FIRST_LABEL = 'Select First Element';
export const SECOND_LABEL = 'Select Second Element';
export const COMPARE_LABEL = 'Compare Styles';
