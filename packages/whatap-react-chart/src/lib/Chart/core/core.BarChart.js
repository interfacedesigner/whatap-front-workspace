import { CHART_TICK_OFFSET_Y, CHART_TICK_SPACE, FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';

export function drawYtick(ctx, args) {
  let options = args;
  let { chartAttr, plots, maxValue, minValue, format, theme, textPosition, maxValueWidth, tick } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;
  let tickValue = maxValue;

  ctx.save();
  ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
  ctx.fillStyle = theme.tick;
  ctx.textAlign = 'right';
  ctx.lineWidth = tick.borderWidth;
  ctx.strokeStyle = tick.borderColor;

  for (let i = 0; i < plots + 1; i++) {
    const textX = x - CHART_TICK_SPACE;
    const textY = y + 3 + i * heightInterval;

    tickValue = Math.abs(tickValue);
    let formattedY = format ? format(tickValue) : tickValue;

    if (tick.borderWidth > 0) {
      ctx.save();
      ctx.strokeStyle = theme.background;
      ctx.strokeText(formattedY, textX, textY);
      ctx.restore();
    }
    ctx.fillText(formattedY, textX, textY);
    tickValue -= (maxValue - minValue) / plots;
  }
  ctx.restore();
}

export function drawXtick(ctx, args) {
  const { chartAttr, tick, theme, data, format } = args;
  const { x, y, w, h } = chartAttr;
  const textY = y + h + FONT_SIZE + CHART_TICK_OFFSET_Y;

  ctx.save();
  ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
  ctx.fillStyle = theme.tick;
  ctx.textAlign = 'center';
  ctx.lineWidth = tick.borderWidth;
  ctx.strokeStyle = tick.borderColor;

  let en = data.keys();
  while (en.hasMoreElements()) {
    let key = en.nextElement();
    let value = data.get(key);
    const textX = x + (value.xPos / 100) * w;
    ctx.beginPath();
    ctx.strokeStyle = theme.xAxisLine;
    ctx.moveTo(textX, textY - FONT_SIZE);
    ctx.lineTo(textX, y + h);
    ctx.stroke();
    ctx.fillText(format ? format(key) : key, textX, textY);
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

export function drawYplot(ctx, args) {
  let options = args;
  let { chartAttr, plots, theme } = options;
  let { x, y, w, h } = chartAttr;
  let heightInterval = h / plots;

  ctx.save();
  for (let i = 0; i < plots + 1; i++) {
    ctx.beginPath();
    ctx.strokeStyle = theme.plotLine;
    ctx.moveTo(x, y + i * heightInterval);
    ctx.lineTo(x + w, y + i * heightInterval);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawXplot(ctx, args) {
  let options = args;
  let { chartAttr, plots, theme } = options;
  let { x, y, w, h } = chartAttr;
  let widthInterval = w / plots;

  ctx.save();
  for (let i = 0; i < plots + 1; i++) {
    ctx.beginPath();
    ctx.strokeStyle = theme.plotLine;

    ctx.moveTo(x + i * widthInterval, y);
    ctx.lineTo(x + i * widthInterval, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

export function getColor(data, defaultColor) {
  let color = defaultColor;
  let value = data.data;

  if (value < 60) {
    color = defaultColor;
  } else if (value < 80) {
    color = '#FFC107';
  } else {
    color = '#F03E3E';
  }
  return color;
}

export function defaultDataFormat(data) {
  if (Number(data)) {
    return Number(Number(data).toFixed(2));
  } else {
    return data;
  }
}
