import { merge } from 'lodash-es';

import { HeapSort, LinkedMap } from '../../core';
import ColorSelector from '../helper/ColorSelector';
import { colorTheme } from '../meta/themeMeta';
import chartOptionSelector from '../util/chartOptionSelector';
import { dataValidation } from '../util/dataValidator';
import { setDpiSupport } from '../util/displayModulator';

class AbstractChart {
  constructor(bindId, options) {
    this.chartType = 'LineChart';
    if (options && options.type) {
      this.chartType = options.type;
    }

    this.init(bindId);
    this.initOptions(options);
    this.initUtils();
  }

  /**
   * Init variables, options, utils
   */
  init = (bindId) => {
    this.chartId = bindId;
    this.canvas = document.getElementById(bindId);
    this.ctx = this.canvas.getContext('2d');
    this.data = new LinkedMap();
    this.palette = ColorSelector.getInstance();
    this.plotPoint = true;
    this.hoveredPlots = false;

    this.themePalette = merge({}, colorTheme);

    this.chartAttr = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };
    this.dots = [];
  };

  initOptions = (options) => {
    const defaultOptions = chartOptionSelector(this.chartType, this.chartSubtype);
    this.config = merge({}, defaultOptions, options);

    this.startTime = this.config.xAxis.startTime;
    this.endTime = this.config.xAxis.endTime;
    this.minValue = this.config.yAxis.minValue;
    this.maxValue = this.config.yAxis.maxValue;
  };

  initUtils = () => {
    this.heapSort = new HeapSort();
    this.dataValidation = dataValidation;
  };

  updateOptions = (newOptions) => {
    this.config = merge({}, this.config, newOptions);
    this.drawChart();
  };

  /**
   * Get screen size & ratio
   */
  wGetBoundingClientRect = () => {
    if (this.bcRect === null || typeof this.bcRect === 'undefined') {
      this.bcRect = this.overrideClientRect();
    }
  };

  overrideClientRect = () => {
    this.bcRect = this.canvas.getBoundingClientRect();
    return this.bcRect;
  };

  resizeCanvas = (element, fixedHeight) => {
    if (!element) {
      element = this.overrideClientRect();
    }

    if (!fixedHeight) {
      this.bcRect = {
        ...this.bcRect,
        width: element.clientWidth,
        height: element.clientHeight,
      };
    } else {
      this.bcRect = {
        ...this.bcRect,
        width: element.clientWidth,
        height: Number(fixedHeight),
      };
    }

    setDpiSupport(this.canvas, this.ctx, this.ratio, this.bcRect);
  };

  drawChart = () => {
    try {
      throw new Error('AbstractChart cannot be instantiated. Please extend this class to utilize it');
    } catch (e) {
      console.log('AbstractChart: Chart instantiation error');
      console.log(e.message);
    }
  };

  resizeCanvasWithSize = (width, height) => {
    this.bcRect = {
      width: width,
      height: height,
    };

    setDpiSupport(this.canvas, this.ctx, this.ratio, this.bcRect);
  };

  destroy = () => {
    this.ctx = undefined;
    this.canvas = undefined;
  };
}

export default AbstractChart;
