import { FONT_SIZE } from '../meta/globalMeta';
import calculateDiff from '../meta/plotMeta';
import { timeToPos } from '../util/positionCalc';

export function drawXplot(ctx, args) {
  let options = args;
  let textWidth = ctx.measureText(options.format).width;
  let { startTime, endTime, chartAttr, minOffset, xPlotLine, theme } = options;
  let { x, y, w, h } = chartAttr;

  let timeDiff = endTime - startTime;
  let interval = calculateDiff(timeDiff);
  let current = startTime - (startTime % interval) + interval;
  let plots = [];

  while (current < endTime) {
    let pos = timeToPos(startTime, endTime, x, x + w, current);

    plots.push(pos);
    current += interval;
  }

  ctx.save();
  plots.map((pl) => {
    ctx.beginPath();
    // ctx.setLineDash([1, 2]);
    // ctx.strokeStyle = xPlotLine.color;
    ctx.strokeStyle = theme.plotLine;
    ctx.moveTo(pl, y);
    ctx.lineTo(pl, y + h);
    ctx.stroke();
  });
  ctx.restore();
}

export function drawYplot(ctx, args) {
  let options = args;
  let { chartAttr, plots, yPlotLine, theme, maxValueWidth, textPosition } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;

  let startX = textPosition === 'inner' ? maxValueWidth + 6 : x;

  ctx.save();
  for (let i = 0; i < plots + 1; i++) {
    ctx.beginPath();
    // ctx.setLineDash([1, 2]);
    // ctx.strokeStyle = yPlotLine.color;
    ctx.strokeStyle = theme.plotLine;
    ctx.moveTo(startX, y + i * heightInterval);
    ctx.lineTo(x + w, y + i * heightInterval);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawXaxis(ctx, args) {
  let options = args;
  let { chartAttr, theme } = options;
  let { x, y, w, h } = chartAttr;

  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = theme.xAxisLine;
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y + h);
  ctx.stroke();

  ctx.restore();
}

export function drawYaxis(ctx, args) {
  let options = args;
  let { chartAttr, theme } = options;
  let { x, y, w, h } = chartAttr;

  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = theme.yAxisLine;
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + h);
  ctx.stroke();

  ctx.restore();
}

export function drawHorizontalLine(ctx, args) {
  const { minValue, maxValue, horizontalLine, chartAttr, hoveredPlots } = args;
  const { x, y, w, h } = chartAttr;
  const chartEnd = x + w;

  ctx.save();
  ctx.textAlign = 'right';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([2, 3]);
  horizontalLine.map((dataSet, idx) => {
    ctx.beginPath();
    const { value, title, color } = dataSet;

    let yPos = 1;
    if (value > minValue) {
      if (value > maxValue) {
        yPos = 0;
      } else {
        yPos = 1 - (value - minValue) / (maxValue - minValue);
      }
    } else {
      yPos = 0.999;
    }

    let yCoord = y + h * yPos;
    ctx.strokeStyle = color;
    ctx.moveTo(x, yCoord);
    ctx.lineTo(chartEnd, yCoord);
    ctx.stroke();
    if (hoveredPlots) {
      let textY = yCoord - 4;
      if (textY < FONT_SIZE) {
        textY += FONT_SIZE + 8;
      }
      ctx.save();
      ctx.setLineDash([]);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.fillStyle = color;
      ctx.strokeText(title, chartEnd - 2, textY);
      ctx.fillText(title, chartEnd - 2, textY);

      ctx.restore();
    }
  });
  ctx.restore();
}

const STATUS_COLOR = {
  UNKNOWN: 'rgba(240, 62, 62, 0.3)',
  // NOMAL: 'rgba(255, 193, 7, 0.3)',
  // INFO: 'rgba(240, 62, 62, 0.3)',
  NOMAL: 'rgba(255,255,255,0)',
  INFO: 'rgba(255,255,255,0)',
  CLIENT_ERROR: 'rgba(255, 193, 7, 0.3)',
  SERVER_ERROR: 'rgba(240, 62, 62, 0.3)',
  CUSTOM: 'rgba(0,151,167, 0.3)',
  UNHANDLED: 'rgba(211,211,211, 0.3)',
};

function httpStatusToColor(status) {
  const s = Number(status);
  if (s < 0) {
    return STATUS_COLOR.UNHANDLED;
  } else if (s === 0) {
    return STATUS_COLOR.UNKNOWN;
  } else if (s < 299) {
    return STATUS_COLOR.NOMAL;
  } else if (s < 399) {
    return STATUS_COLOR.INFO;
  } else if (s < 499) {
    return STATUS_COLOR.CLIENT_ERROR;
  } else if (s < 599) {
    return STATUS_COLOR.SERVER_ERROR;
  } else {
    return STATUS_COLOR.CUSTOM;
  }
}

function drawAdditionalArea(ctx, args) {
  const { fillStyle, datum, xCoord, prevXCoord, yCoord, prevYCoord, areaByData, chartAttr } = args;
  const { x, y, w, h } = chartAttr;
  // 부가 옵션들
  if (areaByData !== false && typeof areaByData === 'object' && areaByData.drawBottomArea === true) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(prevXCoord, prevYCoord);
    ctx.lineTo(prevXCoord, y + h);
    ctx.lineTo(xCoord, y + h);
    ctx.lineTo(xCoord, yCoord);
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.restore();
  }
}

export function drawArea(ctx, args) {
  let { fillStyle, datum, xCoord, prevXCoord, yCoord, prevYCoord, areaByData, chartAttr } = args;
  const { x, y, w, h } = chartAttr;

  xCoord = Math.ceil(xCoord);
  prevXCoord = Math.ceil(prevXCoord);

  ctx.save();
  // ctx.beginPath();
  // select area
  if (areaByData !== false && typeof areaByData === 'object' && areaByData.fullHeight === true) {
    ctx.moveTo(prevXCoord, y);
    ctx.lineTo(prevXCoord, y + h);
    ctx.lineTo(xCoord, y + h);
    ctx.lineTo(xCoord, y);
  } else {
    ctx.moveTo(prevXCoord, prevYCoord);
    ctx.lineTo(prevXCoord, y + h);
    ctx.lineTo(xCoord, y + h);
    ctx.lineTo(xCoord, yCoord);
  }
  // colors
  let fillColor = fillStyle;
  if (areaByData !== false) {
    const datumIdx = areaByData.datumIdx || 2;
    const value = datum[datumIdx];

    if (typeof value !== 'undefined') {
      fillColor = areaByData.setColor ? areaByData.setColor(value) : httpStatusToColor(value);
    }
  }
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.restore();

  drawAdditionalArea(ctx, args);
}

const FOCUS_COLOR = {
  UNFOCUS: 'rgba(102, 102, 102, 0.4)',
  FOCUS: 'rgba(255,255,255,0)',
};
export function drawFocus(ctx, args) {
  const { chartAttr, focus, startTime, endTime } = args;
  const { x, y, w, h } = chartAttr;
  const { stime, etime } = focus;
  if (focus.stime && focus.etime) {
    let startXPos = (stime - startTime) / (endTime - startTime);
    let startXCoord = x + w * startXPos;

    let endXPos = (etime - startTime) / (endTime - startTime);
    let endXCoord = x + w * endXPos;

    ctx.save();
    // select area
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(startXCoord, y + h);
    ctx.lineTo(startXCoord, y);
    ctx.fillStyle = FOCUS_COLOR.UNFOCUS;

    // select area
    ctx.moveTo(endXCoord, y);
    ctx.lineTo(endXCoord, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y);
    ctx.fillStyle = FOCUS_COLOR.UNFOCUS;
    ctx.fill();

    ctx.restore();
  }
}

// export function drawXplot (ctx, args) {
//   let options = args;
//   let textWidth = ctx.measureText(options.format).width;
//   let { startTime, endTime, chartAttr, minOffset, xPlotLine } = options;
//   let { x, y, w, h } = chartAttr;

//   let tickCount = 1;
//   while ((textWidth * tickCount) + (minOffset * 2 * tickCount) < w) {
//     tickCount++;
//   }
//   let timeDiff = (endTime - startTime) / tickCount;
//   let widthInterval = w / tickCount;
//   let textOffset = textWidth / 2;

//   ctx.save();
//   for (let i = 1; i < tickCount; i++) {
//     ctx.beginPath();
//     ctx.setLineDash([1, 2]);
//     ctx.strokeStyle = xPlotLine.color;
//     ctx.moveTo(x + (i * widthInterval), y);
//     ctx.lineTo(x + (i * widthInterval), y + h);
//     ctx.stroke();
//   }
//   ctx.restore();
// }
