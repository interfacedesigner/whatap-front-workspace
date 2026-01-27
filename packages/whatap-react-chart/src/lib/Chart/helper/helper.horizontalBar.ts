export const getBarMargin = (barSize: number) => {
  if (barSize <= 19) {
    return 1;
  } else if (barSize <= 26) {
    return 2;
  } else if (barSize <= 33) {
    return 3;
  } else if (barSize <= 40) {
    return 4;
  } else {
    return 5;
  }
};

export const getLabelFont = (barSize: number) => {
  let fontSize = 12;
  if (barSize > 35) {
    fontSize = 12;
  } else if (barSize > 20) {
    fontSize = 12;
  }

  return `bold ${fontSize}px Roboto`;
};

export const getFontMargin = (barSize: number) => {
  if (barSize <= 20) {
    return 2;
  } else if (barSize <= 30) {
    return 3;
  } else if (barSize <= 40) {
    return 4;
  } else {
    return 5;
  }
};
