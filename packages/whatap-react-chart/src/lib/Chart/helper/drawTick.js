import dayjs from 'dayjs';

import { CHART_TICK_OFFSET_Y, CHART_TICK_SPACE, FONT_SIZE } from '../meta/globalMeta';
import calculateDiff from '../meta/plotMeta';
import { timeToPos } from '../util/positionCalc';

const UNIX_TIMESTAMP = 1000;

export function drawXtick(ctx, args) {
  let options = args;
  let { startTime, endTime, chartAttr, minOffset, theme, tick } = options;
  let { x, y, w, h } = chartAttr;

  let textLength = '';
  let formatType = 'string';
  if (typeof options.format === 'function') {
    formatType = 'function';
    textLength = options.format(new Date().getTime() / UNIX_TIMESTAMP);
  } else {
    textLength = dayjs.unix(new Date().getTime() / UNIX_TIMESTAMP).format(options.format);
  }

  let textWidth = ctx.measureText(textLength).width;
  let totalPlotCnt = (w / textWidth).toFixed(2);
  let textOffset = textWidth / 2;

  let timeDiff = endTime - startTime;
  let interval = calculateDiff(timeDiff);
  let current = startTime - (startTime % interval) + interval;
  let plots = [];

  while (current < endTime) {
    /**
     * plot = [time, pos]
     */
    let pos = timeToPos(startTime, endTime, x, x + w, current);

    plots.push([current, pos]);
    current += interval;
  }
  ctx.save();
  ctx.fillStyle = theme.tick;
  ctx.textAlign = 'left';

  let divisor = 1;
  let plotCount = plots.length * 1.2;
  while (plotCount > totalPlotCnt) {
    divisor += 1;
    plotCount /= 2;
  }

  plots.map((pl, idx) => {
    if (idx % divisor === 0) {
      let timeValue;
      let textX = pl[1] - textOffset;
      let textY = y + h + FONT_SIZE + CHART_TICK_OFFSET_Y;
      if (formatType === 'function') {
        timeValue = options.format(pl[0] / UNIX_TIMESTAMP);
      } else {
        timeValue = dayjs.unix(pl[0] / UNIX_TIMESTAMP).format(options.format);
      }

      if (tick.borderWidth > 0) {
        ctx.save();
        ctx.lineWidth = tick.borderWidth;
        ctx.strokeStyle = tick.borderColor;
        ctx.strokeText(timeValue, textX, textY);
        ctx.restore();
      }
      ctx.beginPath();
      ctx.strokeStyle = theme.xAxisLine;
      ctx.moveTo(textX + textOffset, textY - FONT_SIZE);
      ctx.lineTo(textX + textOffset, y + h);
      ctx.stroke();
      ctx.fillText(timeValue, textX, textY);
    }
  });
  ctx.restore();
}

/**
 * TODO: `drawYtick` 관련 로직 수정 필요
 * yPlot 정수로 dynamic하게 떨어지도록 수정
 */
export function drawYtick(ctx, args) {
  let options = args;
  let { chartAttr, plots, maxValue, minValue, format, theme, textPosition, maxValueWidth, tick, tickAttribute } =
    options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;
  let tickValue = maxValue;

  let f = 0;
  let value = maxValue;
  while (value % 1 !== 0) {
    value *= 10;
    f++;
  }

  value = minValue * Math.pow(10, f);
  while (value % 1 !== 0) {
    value = value * 10;
    f++;
  }

  const powValue = Math.pow(10, f);
  const duration = maxValue * powValue - minValue * powValue;
  const tickDuration = duration / plots / powValue;

  ctx.save();
  ctx.fillStyle = theme.tick;
  ctx.textAlign = 'right';
  ctx.lineWidth = tick.borderWidth;
  ctx.strokeStyle = tick.borderColor;

  if (textPosition === 'inner') {
    // draw Opacity background
    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = theme.background;
    ctx.fillRect(x, y, maxValueWidth + 4, h);
    ctx.restore();
  }

  for (let i = 0; i < plots + 1; i++) {
    let textX, textY;
    switch (textPosition) {
      case 'inner':
        textX = x + maxValueWidth;
        textY = y + (i === plots ? -3 : 4) + i * heightInterval;
        break;
      default:
        textX = x - CHART_TICK_SPACE;
        textY = y + 3 + i * heightInterval;
    }
    tickValue = Math.abs(tickValue);
    let formattedY = format(tickValue || plots - i, tickAttribute);

    if (tick.borderWidth > 0) {
      ctx.save();
      ctx.strokeStyle = theme.background;
      ctx.strokeText(formattedY, textX, textY);
      ctx.restore();
    }
    ctx.fillText(formattedY, textX, textY);

    const powMin = minValue * powValue;
    const powTick = parseFloat((tickDuration * (plots - (i + 1)) * powValue).toFixed(f));

    tickValue = (powMin + powTick) / powValue;
  }
  ctx.restore();
}
