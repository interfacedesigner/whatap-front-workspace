import {
  CHART_NON_TICK_OFFSET_X,
  CHART_TICK_OFFSET_X,
  CHART_TICK_SPACE,
  FONT_SIZE,
  FONT_TYPE,
} from '../meta/globalMeta';
import { calculatePlots } from '../util/positionCalc';

export function definePlotCount(config, height) {
  if (config && config.yAxis) {
    if (config.yAxis.autoPlotEnabled === false) {
      return config.yAxis.plotCount;
    } else if (typeof config.yAxis.maxPlots === 'number') {
      return config.yAxis.maxPlots;
    }
  }

  let plot = calculatePlots(height);
  return plot > 1 ? plot : 1;
}

/**
 * @deprecated Will be removed in the nearby future.
 * @param { any } that
 */
export function getChartAttr(that) {
  let chartAttr = {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  };

  chartAttr.x = getChartPosX(that);
  chartAttr.y = getChartPosY(that);
  chartAttr.w = getChartWidth(that, chartAttr.x);
  chartAttr.h = getChartHeight(that, chartAttr.y);

  return chartAttr;
}

function getChartPosX(that) {
  const config = that.config;
  const maxValueWidth = that.maxValueWidth;
  if (config.horizontally) {
    return CHART_NON_TICK_OFFSET_X + config.common.offset.left;
  } else if (config.yAxis.tick.display && config.yAxis.textPosition !== 'inner') {
    return maxValueWidth + CHART_TICK_SPACE + CHART_TICK_OFFSET_X;
  }

  return CHART_NON_TICK_OFFSET_X + config.common.offset.left;
}

function getChartPosY(that) {
  const config = that.config;
  if (config.horizontally) {
    return 3;
  } else {
    return 10 + config.common.offset.top;
  }
}

function getChartWidth(that, chartX) {
  const config = that.config;

  const calcWidth = that.bcRect.width - chartX - config.common.offset.right;
  return calcWidth > 0 ? calcWidth : 0;
}

function getChartHeight(that, chartY) {
  const config = that.config;

  let calcHeight = that.bcRect.height - chartY - config.common.offset.bottom;
  calcHeight -= config.xAxis.tick.display ? 20 : 5;

  return calcHeight > 0 ? calcHeight : 0;
}
