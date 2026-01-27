export const drawTextBox = (ctx: CanvasRenderingContext2D, text: string, xPos: number, yPos: number) => {
  const padding = 4;
  const radius = 2;
  const tailSize = 3;
  ctx.save();
  const textWidth = ctx.measureText(text).width;
  const x1 = xPos - textWidth / 2 - padding;
  const x2 = xPos + textWidth / 2 + padding;
  const y1 = yPos - 7;
  const y2 = yPos + 6;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(x1 + radius, y1);
  ctx.lineTo(x2 - radius, y1);
  ctx.arcTo(x2, y1, x2, y1 + radius, radius);
  ctx.lineTo(x2, y2 - radius);
  ctx.arcTo(x2, y2, x2 - radius, y2, radius);

  //말풍선 아래 꼬리
  ctx.lineTo(xPos + tailSize, y2);
  ctx.lineTo(xPos, y2 + tailSize);
  ctx.lineTo(xPos - tailSize, y2);

  ctx.lineTo(x1 + radius, y2);
  ctx.arcTo(x1, y2, x1, y2 - radius, radius);
  ctx.lineTo(x1, y1 + radius);
  ctx.arcTo(x1, y1, x1 + radius, y1, radius);
  // ctx.fill();
  ctx.stroke();
  ctx.restore();
  ctx.fillText(text, xPos, yPos);
};

export const fillCuttingText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  xPos: number,
  yPos: number,
  maxWidth: number,
  ellipsis: boolean = false,
) => {
  if (typeof text === 'number') {
    text = `${text}`;
  }
  if (typeof text === 'undefined' || text === null) {
    text = '';
  }
  if (typeof text !== 'string') {
    console.warn('chart etxt is not string');
    return;
  }
  let textWidth = ctx.measureText(text).width;
  let cuttingText = text;
  if (textWidth <= maxWidth) {
  } else {
    const textLength = text.length;
    const vec = textWidth / 2 > maxWidth;
    if (vec) {
      cuttingText = '';
      for (let i = 0; i < textLength; i++) {
        cuttingText += text[i];
        if (ctx.measureText(cuttingText + text[i + 1] + (ellipsis ? '...' : '')).width > maxWidth) {
          break;
        }
      }
    } else {
      for (let i = textLength - 1; i >= 0; i--) {
        cuttingText = cuttingText.slice(0, -1);
        if (ctx.measureText(ellipsis ? cuttingText + '...' : cuttingText).width < maxWidth) {
          break;
        }
      }
    }
    if (ellipsis) {
      cuttingText += '...';
    }
  }
  ctx.fillText(cuttingText, xPos, yPos);
};
