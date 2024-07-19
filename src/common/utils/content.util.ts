export const createElement = (tag: string, id: string, styles: any) => {
  const element = document.createElement(tag);
  element.id = id;
  Object.assign(element.style, styles);

  // Añadir efecto hover
  element.addEventListener('mouseover', () => {
    if (styles.hover) {
      Object.assign(element.style, styles.hover);
    }
  });

  element.addEventListener('mouseout', () => {
    if (styles.hover) {
      Object.assign(element.style, {
        backgroundColor: styles.backgroundColor,
      });
    }
  });

  return element;
};
