import { PLOT_STANDARD } from '../meta/globalMeta';
import { calculateMinimum } from '../meta/plotMeta';

const tooltipCalcX = (startTime, endTime, startPos, endPos, mousePosX) => {
  let timeDiff = endTime - startTime;
  let posDiff = endPos - startPos;
  let timeValue = (timeDiff * (mousePosX - startPos)) / posDiff + startTime;

  return parseInt(timeValue);
};

const tooltipCalcY = (minValue, maxValue, startPos, endPos, mousePosY) => {
  let valueDiff = maxValue - minValue;
  let posDiff = endPos - startPos;
  let value = maxValue - (valueDiff * (mousePosY - startPos)) / posDiff;

  return value;
};

const tooltipRange = (dots) => {
  let minimumtooltipRange = dots[1].time - dots[0].time;

  for (let i = 2; i < dots.length; i++) {
    let currenttooltipRange = dots[i].time - dots[i - 1].time;
    if (currenttooltipRange > 0) {
      if (currenttooltipRange < minimumtooltipRange) {
        minimumtooltipRange = currenttooltipRange;
      }
    }
  }

  return minimumtooltipRange;
};

const timeToPos = (startTime, endTime, startPos, endPos, time) => {
  let timeDiff = endTime - startTime;
  let posDiff = endPos - startPos;

  let posValue = (posDiff * (time - startTime)) / timeDiff + startPos;

  return posValue;
};

const calculatePlots = (height) => {
  let value = parseInt(height / PLOT_STANDARD);
  if (value % 2 === 1) {
    value++;
  }
  return value;
};

const getMaxValue = (data, plots, unitDivider = 1000) => {
  return calculateMinimum(data, plots, unitDivider) * plots;
};

const calculateStackPos = (datum, minValue, maxValue) => {
  let output = 0.999;

  if (datum > minValue) {
    if (datum > maxValue) {
      output = 0;
    } else {
      output = 1 - (datum - minValue) / (maxValue - minValue);
    }
  }
  return output;
};

export { tooltipCalcX, tooltipCalcY, tooltipRange, timeToPos, getMaxValue, calculatePlots, calculateStackPos };
