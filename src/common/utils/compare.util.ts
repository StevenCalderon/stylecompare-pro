export const compareTwoStyles = (styles1: { [key: string]: string }, styles2: { [key: string]: string }) => {
  const differences: { [key: string]: { style1: string; style2: string } } = {};
  for (const key in styles1) {
    if (styles1.hasOwnProperty(key)) {
      if (styles2[key] !== styles1[key]) {
        differences[key] = { style1: styles1[key], style2: styles2[key] };
      }
    }
  }

  for (const key in styles2) {
    if (styles2.hasOwnProperty(key) && !styles1.hasOwnProperty(key)) {
      differences[key] = { style1: 'Not Set', style2: styles2[key] };
    }
  }
  return differences;
};
