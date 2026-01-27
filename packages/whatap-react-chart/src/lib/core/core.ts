export function getMinValueIndexFromArray(array) {
  if (!Array.isArray(array) && array.length === 0) {
    try {
      throw new Error('Provide a valid array to compare');
    } catch (e) {
      console.log('Core: Invalid array type');
      console.log(e.message);
    }
  }
  let min = array[0];
  let index = 0;
  array.map((item, idx) => {
    if (Number(item) < min) {
      min = item;
      index = idx;
    }
  });
  return { min, index };
}

export function formatRgb(rgb, alpha) {
  if (!Array.isArray(rgb) && rgb.length < 3) {
    try {
      throw new Error('Invalid array value');
    } catch (e) {
      console.log('Core: Invalid array type');
      console.log(e.message);
    }
  }
  if (alpha) {
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  } else {
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
  }
}

export function parseHexToRgb(hexString) {
  const defaultColorValue = 128;
  const value = hexString.trim().replace('#', '');

  const shortHex = value.length === 3;

  const matchCase = shortHex
    ? /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i
    : /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const result = matchCase.exec(value);

  if (![3, 6].includes(value.length) || !result) {
    return [defaultColorValue, defaultColorValue, defaultColorValue];
  }

  return shortHex
    ? [
        parseInt(`${result[1]}${result[1]}`, 16),
        parseInt(`${result[2]}${result[2]}`, 16),
        parseInt(`${result[3]}${result[3]}`, 16),
      ]
    : [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}
