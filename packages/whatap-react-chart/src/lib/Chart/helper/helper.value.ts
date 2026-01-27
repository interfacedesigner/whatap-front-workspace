//해당 수의 가까운 Max 값을 찾는 함수
import { ChartAttribute, TickAttribute } from '../interfaces/BaseInterface';
import { PLOT_STANDARD } from '../meta/globalMeta';

export const getMaxValue = (
  value: number,
  plots: number = 1,
  unitDivider: number = 1000,
  integerOnly: boolean = false,
): TickAttribute => {
  const calc = calculateMinimum(value, plots, unitDivider, integerOnly);
  const maxValue = calc.tickValue * plots;
  return {
    value,
    plots,
    unitDivider,
    maxValue,
    ...calc,
  };
};

// 1000, 1024 등 숫자 표현 단위에 맞게
export const calculateMinimum = (
  value: number,
  tickCount: number,
  unitDivider: number,
  integerOnly: boolean,
): Pick<TickAttribute, 'powValue' | 'f' | 'tickValue'> => {
  const powValue = Math.max(Math.floor(Math.log(value) / Math.log(unitDivider)), 0);
  const divider = Math.pow(unitDivider, powValue);
  const tickUnitVal = value / tickCount;
  const scaledTickUnitVal = (tickUnitVal * 1.2) / divider;
  const adjacentVal = toAdjacentVal(scaledTickUnitVal, powValue ? false : integerOnly);
  const tickValue = adjacentVal.value * divider;

  return {
    f: adjacentVal.f,
    tickValue,
    powValue,
  };
};

export const toAdjacentVal = (value: number, integerOnly: boolean): Pick<TickAttribute, 'f' | 'value'> => {
  const powVal = value <= 1 ? 0 : Math.floor(Math.log10(value));
  const divider = Math.pow(10, powVal);
  const floatVal = value / divider;
  const remainder = floatVal % 1;
  let tickValue = 1;
  let f = 0;
  if (!remainder) {
    tickValue = value;
  } else {
    if (remainder > 0.5) {
      tickValue = Math.ceil(floatVal) * divider;
    } else {
      tickValue = (Math.floor(floatVal) + 0.5) * divider;
      if (tickValue < 10) {
        f = 1;
        if (integerOnly) {
          tickValue = Math.ceil(tickValue);
          f = 0;
        }
      }
    }
  }

  return { value: tickValue, f };
};

export const widthCuttingText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  direction: boolean = true,
): string => {
  if (typeof text !== 'string') {
    return '';
  }
  let textWidth = ctx.measureText(text).width;
  let cuttingText = text;
  if (textWidth <= maxWidth) {
  } else {
    const textLength = text.length;
    const vec = textWidth / 2 > maxWidth;
    if (direction) {
      if (vec) {
        cuttingText = '';
        for (let i = 0; i < textLength; i++) {
          if (ctx.measureText(cuttingText + text[i + 1]).width > maxWidth) {
            break;
          }
          cuttingText += text[i];
        }
      } else {
        for (let i = textLength - 1; i >= 0; i--) {
          cuttingText = cuttingText.slice(0, -1);
          if (ctx.measureText(cuttingText).width < maxWidth) {
            break;
          }
        }
      }
    } else {
      cuttingText = '';
      for (let i = textLength - 1; i >= 0; i--) {
        const char = text[i];
        if (ctx.measureText(char + cuttingText).width > maxWidth) {
          break;
        }
        cuttingText = char + cuttingText;
      }
    }
  }

  return cuttingText;
};

// Y축의 Plots 개수를 구한다 (0을 제외한 plot의 수는 무조건 짝수 (ex yTick이 0, 5, 10 순서의 경우 plotCount = 2개))
export const definePlotCount = (height: number): number => {
  let plotCount = Math.floor(height / PLOT_STANDARD);
  if (plotCount % 2 === 1) {
    plotCount++;
  }

  return plotCount || 1;
};

//숫자 1000 단위마다 쉼표를 찍어준다.
export const defaultYAxisFormat = (d: number | string, op?: TickAttribute) => {
  return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const getDrawAreaX = (xPos: number, chartAttr: ChartAttribute) => {
  let x: number = xPos;
  x = x < chartAttr.x ? chartAttr.x : x;
  x = x > chartAttr.widthX ? chartAttr.widthX : x;
  return x;
};

//값이 숫자인지 확인
export const checkNumber = (value: any) => {
  try {
    value = parseInt(value);
    return typeof value === 'number' && !isNaN(value);
  } catch {
    return false;
  }
};

// 천 단위마다 콤마 추가
export const addComma = (value: number): string => {
  if (typeof value === 'number') {
    const parts = value.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  } else {
    return value;
  }
};

export const fittingString = (ctx: CanvasRenderingContext2D, str: string, maxWidth: number) => {
  if (!str || !Number(maxWidth)) {
    return '';
  }
  let width = ctx.measureText(str).width;
  let ellipsis = '…';
  let ellipsisWidth = ctx.measureText(ellipsis).width;

  if (width <= maxWidth || width <= ellipsisWidth) {
    return str;
  } else {
    let len = str.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
      str = str.substring(0, len);
      width = ctx.measureText(str).width;
    }
    return str + ellipsis;
  }
};
