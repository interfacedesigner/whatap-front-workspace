export function setDpiSupport(canvas, ctx, ratio, rect) {
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

export function getScreenRatio(ratio) {
  let value = ratio;
  if (value === null || typeof value === 'undefined') {
    value = window.devicePixelRatio;
  }

  if (value >= 2) {
    value = 2;
  } else {
    value = 1;
  }
  return value;
}

/**
 * Width / Height 값을 구할 때, Ratio 값을 감안한다. (Retina와 같은 Display에 대응)
 * @param { number } length
 * @param { number } ratio
 */
export function applyRatio(length, ratio) {
  return length / ratio;
}
