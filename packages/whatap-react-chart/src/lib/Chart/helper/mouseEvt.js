/**
 * getMousePos
 * @param {evt} evt
 * @param {canvas rect} rect
 */

function getMousePos(evt, rect) {
  if (evt.touches) {
    if (evt.touches[0]) {
      return {
        mx: evt.touches[0].clientX - rect.left,
        my: evt.touches[0].clientY - rect.top,
      };
    } else if (evt.changedTouches && evt.changedTouches[0]) {
      return {
        mx: evt.changedTouches[0].clientX - rect.left,
        my: evt.changedTouches[0].clientY - rect.top,
      };
    } else {
      return {
        mx: 0,
        my: 0,
      };
    }
  }
  return {
    mx: evt.clientX - rect.left,
    my: evt.clientY - rect.top,
  };
}

export { getMousePos };
