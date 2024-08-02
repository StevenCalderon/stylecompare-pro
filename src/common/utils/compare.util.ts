import { StylesType } from '../model/differences.model';

export const compareTwoStyles = (styles1: StylesType, styles2: StylesType) => {
  const diff1: StylesType = {};
  const diff2: StylesType = {};
  for (const key in styles1) {
    if (styles1.hasOwnProperty(key)) {
      if (styles2[key] !== styles1[key]) {
        diff1[key] = styles1[key];
        diff2[key] = styles2[key];
      }
    }
  }

  for (const key in styles2) {
    if (styles2.hasOwnProperty(key) && !styles1.hasOwnProperty(key)) {
      diff1[key] = 'Not Set';
      diff2[key] = styles2[key];
    }
  }
  return { diff1, diff2 };
};
