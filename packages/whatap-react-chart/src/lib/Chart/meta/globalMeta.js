export const FONT_SIZE = 12;
export const FONT_TYPE = 'Roboto';

export const CHART_TICK_SPACE = 5;
export const CHART_TICK_OFFSET_X = 12;
export const CHART_TICK_OFFSET_Y = 5;
export const CHART_NON_TICK_OFFSET_X = 2;

export const CANVAS_TICK_SIDE_OFFSET = 5;
export const CANVAS_NON_TICK_SIDE_OFFSET = 2;
export const CANVAS_TICK_TOPBOTTOM_OFFSET = 10;
export const CANVAS_TICK_BOTTOM_OFFSET = 20;
export const CANVAS_NON_TICK_TOPBOTTOM_OFFSET = 5;

export const CHART_YTICK_SPACE = 30;

export const PLOT_STANDARD = 40;

export function fittingString(c, str, maxWidth) {
  var width = c.measureText(str).width;
  var ellipsis = '…';
  var ellipsisWidth = c.measureText(ellipsis).width;
  if (width <= maxWidth || width <= ellipsisWidth) {
    return str;
  } else {
    var len = str.length;
    while (width >= maxWidth - ellipsisWidth && len-- > 0) {
      str = str.substring(0, len);
      width = c.measureText(str).width;
    }
    return str + ellipsis;
  }
}
