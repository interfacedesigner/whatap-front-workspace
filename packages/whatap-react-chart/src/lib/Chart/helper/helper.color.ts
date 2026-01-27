export function formatRgb(rgb: string, alpha?: number) {
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

export function hexToRgb(hex: string, alpha: number = 1) {
  hex = hex.replace('#', '');
  let value: RegExpMatchArray | null = hex.match(/[a-f\d]/gi);
  let rgbType = '';

  if (value.length == 3) {
    hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
  }
  value = hex.match(/[a-f\d]{2}/gi);

  let r = parseInt(value[0], 16);
  let g = parseInt(value[1], 16);
  let b = parseInt(value[2], 16);

  rgbType = `rgba(${r},${g},${b},${alpha})`;

  return rgbType;
}

interface RgbaAttr {
  r: number;
  g: number;
  b: number;
  a?: number;
}

const getRgb = (color: string) => {
  const rtVal: RgbaAttr = {
    r: 180,
    g: 180,
    b: 180,
  };

  try {
    if (color.indexOf('#') !== -1) {
      //hex값의 경우
      let value: RegExpMatchArray | null = color.match(/[a-f\d]/gi);
      if (value) {
        if (value.length === 3) {
          color = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
        }
        value = color.match(/[a-f\d]{2}/gi);
        if (value) {
          rtVal.r = parseInt(value[0], 16);
          rtVal.g = parseInt(value[1], 16);
          rtVal.b = parseInt(value[2], 16);
        }
      }
    } else {
      //rgb값의 경우
      color = color.replace(/\s/gi, '');
      let value = color.split('(')[1];
      if (typeof value === 'string') {
        value = value.split(')')[0];
        if (value) {
          const colorset = value.split(',');
          rtVal.r = parseInt(colorset[0]);
          rtVal.g = parseInt(colorset[1]);
          rtVal.b = parseInt(colorset[2]);
          if (colorset[3]) {
            rtVal.a = parseFloat(colorset[3]);
          }
        }
      }
    }
  } catch (e) {
    console.warn(e);
  }

  return rtVal;
};

const correctionColor = (value: num) => {
  if (value < 0) {
    return 0;
  }

  if (value > 255) {
    return 255;
  }

  return value;
};

export const getColorVariation = (color: string, vRgba: Partial<RgbaAttr>) => {
  const rgba = getRgb(color);
  const r = correctionColor(rgba.r + (vRgba.r || 0));
  const g = correctionColor(rgba.g + (vRgba.g || 0));
  const b = correctionColor(rgba.b + (vRgba.b || 0));
  if (typeof vRgba.a !== 'undefined') {
    return `rgba(${r},${g},${b},${vRgba.a})`;
  } else {
    return `rgb(${r},${g},${b})`;
  }
};
