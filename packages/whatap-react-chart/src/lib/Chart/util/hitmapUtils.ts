import { MouseAttribute } from '../interfaces/BaseInterface';
import { HitmapDataProps } from '../interfaces/ConfigInterface';
import { HitmapDataset, HitmapStr } from '../interfaces/HitmapInterface';

export function minimumRangeCalc(mousePos: MouseAttribute) {
  return Math.abs(mousePos.x2 - mousePos.x1) < 3 || Math.abs(mousePos.y2 - mousePos.y1) < 3;
}

/**
 *
 * 히트맵 데이터 유효성 판단
 *
 * @description undefined 여부, hit 데이터가 존재하고 길이가 1이상인지 확인
 *
 * @description err 데이터는 체크하지 않는다.
 */
export function hitmapDataVerifier(dataset?: HitmapDataset): dataset is HitmapDataset {
  if (!dataset || (dataset && !dataset.hit) || (dataset && dataset.hit && dataset.hit.length === 0)) {
    return false;
  }
  return true;
}

export function mergeDataset(original: any, merge: any) {
  let oriClone = original.slice(0);
  if (Array.isArray(merge)) {
    merge.map((m, idx) => {
      oriClone[idx] = Math.max(oriClone[idx], m);
    });
  }
  return oriClone;
}

export function getCurrentXPosition(
  x: number,
  width: number,
  currentTime: number,
  startTime: number,
  duration: number,
) {
  return x + (width * (currentTime - startTime)) / duration;
}

export function getCurrentYPosition(y: number, height: number, columnCount: number, idx: number) {
  return y + height - (height / columnCount) * (idx + 1);
}

export function defineErrorExists(datum: number) {
  if (datum === 0) {
    return false;
  }
  return true;
}

export function defineBlockColor(
  mode: HitmapStr,
  value: number,
  level: HitmapDataProps<number>,
  color: HitmapDataProps<string>,
) {
  if (value > level[mode][2]) {
    return color[mode][2];
  } else if (value > level[mode][1]) {
    return color[mode][1];
  } else {
    return color[mode][0];
  }
}

export function getUnitHeight(value: number, height: number) {
  let units = height / 20;
  while (units > value) {
    units = height / 20;
  }
  if (units < 1) {
    units = 1;
  }

  let out = value / units;
  if (out > 100) {
    return (out / 100) * 100;
  } else {
    return out;
  }
}

export function calculateHitmapArea(w: number, h: number) {
  let width = w;
  let height = h;
  let widthCut = 0.5;
  let heightCut = 0.5;

  if (w <= 3) {
    widthCut = -2;
  } else if (w <= 5) {
    widthCut = -0.8;
  } else if (w < 10) {
    widthCut = 0.1;
  }

  if (h <= 3) {
    heightCut = -0.4;
  } else if (h <= 5) {
    heightCut = -0.1;
  } else if (h < 10) {
    heightCut = 0.1;
  }

  if (w < 1) {
    width = 1;
  }
  if (h < 2) {
    height = 2;
  }

  return {
    width: width - widthCut,
    height: height - heightCut,
  };
}
