import { merge } from 'lodash-es';

import { definePlotCount, getChartAttr } from '../core/core.WChart';
import { drawXaxis, drawXplot, drawYaxis, drawYplot } from '../helper/drawBorder';
import { drawHelper } from '../helper/drawHelper';
import { drawXtick, drawYtick } from '../helper/drawTick';
import Tooltip from '../helper/drawTooltip';
import { getMousePos } from '../helper/mouseEvt';
import {
  CHART_NON_TICK_OFFSET_X,
  CHART_TICK_OFFSET_X,
  CHART_TICK_SPACE,
  FONT_SIZE,
  FONT_TYPE,
} from '../meta/globalMeta';
import { calculateFormat } from '../meta/plotMeta';
import ChartObserver from '../observer/ChartObserver';
import { getScreenRatio } from '../util/displayModulator';
import { calculatePlots, tooltipCalcX, tooltipRange } from '../util/positionCalc';
import AbstractChart from './AbstractChart';

/**
 * TODO: 색상 관련 문제 해결 및 Dark Theme 대응 처리
 * TODO: Palette 관련 문제 해결 -> Singleton으로 변경할 필요 있음
 */
class WChart extends AbstractChart {
  constructor(bindId, options) {
    super(bindId, options);
    this.setTheme();
    this.initCanvas();

    this.initListener();

    this.focused = [];

    this.mouseAttr = {
      x1: 0,
      x2: 0,
      down: false,
    };

    this.isSubscribed = true;
    this.chartMouseClick = undefined;
    this.chartObserver = ChartObserver.getInstance();

    this.subscribeObserver();
  }

  notifyObserver = (eventName, data) => {
    this.chartObserver.notify(eventName, data);
  };

  addTheme = (theme) => {
    this.themePalette = merge(this.themePalette, theme);
  };

  setTheme = (theme, override = false) => {
    if (typeof theme === 'undefined' || this.themePalette[theme] === undefined) {
      theme = 'wh';
    }
    this.theme = this.themePalette[theme];
    this.themeId = theme;

    if (override) {
      this.drawChart();
    }
  };

  initCanvas = () => {
    this.wGetBoundingClientRect(this.canvas);
    this.ratio = getScreenRatio(this.ratio);

    let width = this.bcRect.width;
    let height = this.bcRect.height;

    this.canvas.width = width * this.ratio;
    this.canvas.height = height * this.ratio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';

    this.ctx.scale(this.ratio, this.ratio);

    this.drawPreBackground();
  };

  initListener = () => {
    this.tooltip = new Tooltip();
    this.canvas.addEventListener('mouseover', this.handleMouseOver);
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseout', this.handleMouseOut);
    this.canvas.addEventListener('click', this.handleMouseClick);
  };

  subscribeObserver = () => {
    this.chartObserver.subscribe('clicked', this.drawSelectedGlobal, this);
  };

  handleMouseOver = (evt) => {
    let canvas = this.canvas;
    let ctx = this.ctx;
    let mousePos = getMousePos(evt, this.overrideClientRect());

    let textOutput = this.findTooltipData(mousePos);
    let plotOutput = this.findPlotPoint(mousePos);

    if (textOutput !== null) {
      canvas.style.cursor = 'pointer';
      this.mouseFollow = true;
      this.tooltip.append(evt, textOutput);
    }

    if (plotOutput) {
      this.plotPoint = true;
    }
  };

  handleMouseDown = (evt) => {
    const config = this.config;

    if (config.common.drag) {
      const mouseAttr = this.mouseAttr;
      const mousePos = getMousePos(evt, this.overrideClientRect());

      mouseAttr.x1 = mouseAttr.x2 = mousePos.mx;
      mouseAttr.down = true;

      document.addEventListener('mousemove', this.handleDragMouseMove, true);
      document.addEventListener('mouseup', this.handleDragMouseUp, true);
    }
  };

  handleDragMouseMove = (evt) => {
    const mouseAttr = this.mouseAttr;
    if (mouseAttr.down) {
      const mousePos = getMousePos(evt, this.overrideClientRect());

      mouseAttr.x2 = mousePos.mx;
      this.drawChart();
    }
  };

  handleDragMouseUp = (evt) => {
    const mouseAttr = this.mouseAttr;
    const mousePos = getMousePos(evt, this.overrideClientRect());
    const config = this.config;
    const startTime = this.startTime;
    const endTime = this.endTime;
    const xStart = this.chartAttr.x;
    const xEnd = this.chartAttr.x + this.chartAttr.w;

    mouseAttr.x2 = mousePos.mx;
    // mouseAttr.down = false; click에서 false로 변경

    if (config.common.dragCallback) {
      let startPos = mouseAttr.x1;
      let endPos = mouseAttr.x2;
      if (startPos > endPos) {
        /**
         * start position이 end position보다 클 경우 반전 작업
         * */
        const temp = startPos;
        startPos = endPos;
        endPos = temp;
      }
      let stime = tooltipCalcX(startTime, endTime, xStart, xEnd, startPos);
      let etime = tooltipCalcX(startTime, endTime, xStart, xEnd, endPos);

      if (etime - stime > 30000 && Math.abs(this.mouseAttr.x1 - this.mouseAttr.x2) > 3) {
        config.common.dragCallback(stime, etime);
      }
    }

    document.removeEventListener('mousemove', this.handleDragMouseMove, true);
    document.removeEventListener('mouseup', this.handleDragMouseUp, true);
  };

  handleMouseMove = (evt) => {
    let mousePos = getMousePos(evt, this.overrideClientRect());
    let canvas = this.canvas;
    let ctx = this.ctx;
    let config = this.config;
    let { x, y, w, h } = this.chartAttr;
    let { mx, my } = mousePos;
    let { timeDiff } = config.xAxis;

    let textOutput = this.findTooltipData(mousePos);
    let plotOutput = this.findPlotPoint(mousePos);

    if (textOutput !== null) {
      canvas.style.cursor = 'pointer';
      this.mouseFollow = true;
      if (this.tooltip.tooltipOn) {
        this.tooltip.follow(evt, textOutput);
      } else {
        this.tooltip.append(evt, textOutput);
      }
    } else {
      if (!this.mouseFollow) {
        this.tooltip.remove();
      }
    }

    if (plotOutput) {
      this.plotPoint = true;
    }

    this.drawChart();

    if (config.common.drawHelper) {
      drawHelper(ctx, this.chartAttr, mousePos, {
        startTime: this.startTime,
        endTime: this.endTime,
        maxValue: this.maxValue,
        minValue: this.minValue,
        xAxisFormat: config.xAxis.tick.format || calculateFormat(timeDiff),
        yAxisFormat: config.yAxis.tick.format,
      });
    }
  };

  handleMouseOut = (evt) => {
    let canvas = this.canvas;
    canvas.style.cursor = 'default';
    this.mouseFollow = false;
    this.tooltip.remove();

    this.hoveredPlots = false;

    this.drawChart();
  };

  handleMouseClick = (evt) => {
    if (this.mouseAttr.down) {
      this.mouseAttr.down = false;
      this.drawChart();
      if (Math.abs(this.mouseAttr.x1 - this.mouseAttr.x2) > 3) {
        return;
      }
    }
    let mousePos = getMousePos(evt, this.overrideClientRect());
    let { mx, my } = mousePos;
    let max = this.dots.length;
    let startTime = this.startTime;
    let endTime = this.endTime;
    let xStart = this.chartAttr.x;
    let xEnd = this.chartAttr.x + this.chartAttr.w;
    let config = this.config;

    let timeValue = tooltipCalcX(startTime, endTime, xStart, xEnd, mx);

    let clickRange = 1000;
    if (this.dots.length > 1) {
      clickRange = tooltipRange(this.dots);
    }

    let selectedDot;
    let dots = [];
    let nearTime = 0;
    for (let i = 0; i < max; i++) {
      let dot = this.dots[i];
      if (dot.time > timeValue - clickRange / 2 && dot.time < timeValue + clickRange / 2) {
        nearTime = dot.time;
        if (dot.y > my - dot.offset && dot.y < my + dot.offset) {
          selectedDot = dot;
        }
      }
    }

    if (nearTime && typeof config.common.onTimeSelect === 'function' && !this.mouseAttr.down) {
      if (config.common.onTimeSelect(nearTime)) {
        this.selectRedLine = nearTime;
      }
    }

    if (selectedDot) {
      for (let i = 0; i < max; i++) {
        let dot = this.dots[i];
        if (
          dot.time > timeValue - clickRange / 2 &&
          dot.time < timeValue + clickRange / 2 &&
          selectedDot.id === dot.id
        ) {
          dots.push(dot);
        }
      }
    }

    this.drawSelected(dots);
    this.handleMouseOver(evt);

    if (this.isSubscribed) {
      this.notifyObserver('clicked', dots);
    }

    if (this.chartMouseClick) {
      this.chartMouseClick(dots);
    }
  };

  findTooltipData = (pos) => {
    try {
      throw new Error('WChart cannot be instantiated. Please extend this class to utilize it');
    } catch (e) {
      console.log('WChart: Chart instantiation error');
      console.log(e.message);
    }
  };

  findPlotPoint = (pos) => {
    try {
      throw new Error('WChart cannot be instantiated. Please extend this class to utilize it');
    } catch (e) {
      console.log('WChart: Chart instantiation error');
      console.log(e.message);
    }
  };

  drawChart = () => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    let validated = this.dataValidation();

    this.drawPreBackground();
    if (validated) {
      this.drawData();
      this.drawPostBackground();
    }
  };

  drawData = () => {
    try {
      throw new Error('WChart cannot be instantiated. Please extend this class to utilize it');
    } catch (e) {
      console.log('WChart: Chart instantiation error');
      console.log(e.message);
    }
  };

  drawSelected = (dots) => {
    const config = this.config;

    this.focused = dots;

    /**
     * When a chart is selected, bring the designated chart to the front.
     * This way, It will be more clear to see which chart has been selected.
     */
    if (config.common.bringFocusFront) {
      this._bringFocusFront();
    }

    this.drawChart();
  };

  drawSelectedGlobal = (dots) => {
    const config = this.config;
    if (this.isSubscribed) {
      this.focused = dots;

      if (config.common.bringFocusFront) {
        this._bringFocusFront();
      }

      this.drawChart();
    }
  };

  drawPreBackground = () => {
    this._drawBackground();
    this._drawPlot();
  };

  drawPostBackground = () => {
    this._drawAxis();
    // this._drawLabel();

    if (this.mouseAttr.down) {
      this._drawMouseDrag();
    }
  };

  resetData = () => {
    this.data.clear();
  };

  /**
   * @private
   */
  _drawBackground = () => {
    let that = this;
    let ctx = this.ctx;
    let width = this.bcRect.width;
    let height = this.bcRect.height;
    let config = this.config;
    ctx.clearRect(0, 0, width, height);

    ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
    // ctx.save();
    let yAxisMax = this.config.yAxis.tick.format(this.maxValue, this.tickAttribute);
    this.maxValueWidth = parseInt(ctx.measureText(yAxisMax).width);

    this.chartAttr = getChartAttr(this);
    this.plots = definePlotCount(config, this.chartAttr.h);

    let maxWidth = this.maxValueWidth;

    let tickValue = this.maxValue;
    for (let i = 0; i < this.plots + 1; i++) {
      tickValue = Math.abs(tickValue);
      const text = this.config.yAxis.tick.format(tickValue, this.tickAttribute);
      const width = parseInt(ctx.measureText(text).width);
      maxWidth = maxWidth < width ? width : maxWidth;
      tickValue -= (this.maxValue - this.minValue) / this.plots;
    }

    if (this.maxValueWidth < maxWidth) {
      this.maxValueWidth = maxWidth;
      this.chartAttr = getChartAttr(this);
    }
    // this.plots       = typeof config.yAxis.maxPlots === "number" ? config.yAxis.maxPlots : calculatePlots(this.chartAttr.h);

    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width, height);

    // ctx.fillStyle = "rgb(50,100,100)";
    // ctx.fillRect(this.chartAttr.x, this.chartAttr.y, this.chartAttr.w, this.chartAttr.h);
  };

  _drawPlot = () => {
    let ctx = this.ctx;
    let config = this.config;
    let startTime = this.startTime;
    let endTime = this.endTime;
    let chartAttr = this.chartAttr;
    let plots = this.plots;
    let theme = this.theme;
    let minValue = this.minValue;
    let maxValue = this.maxValue;
    let maxValueWidth = this.maxValueWidth;
    let xAxisFormat = config.xAxis.tick.format;
    let yAxisFormat = config.yAxis.tick.format;
    let diff = endTime - startTime;
    const { plotLine: xPlotLine, axisLine: xAxisLine, timeDiff } = config.xAxis;
    const { plotLine: yPlotLine, axisLine: yAxisLine, textPosition } = config.yAxis;

    const xOptions = {
      format: xAxisFormat || calculateFormat(diff),
      minOffset: 3,
      chartAttr,
      startTime,
      endTime,
      xPlotLine,
      xAxisLine,
      theme,
    };
    const yOptions = {
      format: yAxisFormat,
      minValue,
      maxValue,
      plots,
      chartAttr,
      yPlotLine,
      yAxisLine,
      theme,
      textPosition,
      maxValueWidth,
    };

    /**
     * Plot gridline
     */
    if (config.xAxis.plotLine.display) {
      drawXplot(ctx, xOptions);
    }
    if (config.yAxis.plotLine.display) {
      drawYplot(ctx, yOptions);
    }
  };

  /**
   * @private
   */
  _drawAxis = () => {
    let ctx = this.ctx;
    let config = this.config;
    let startTime = this.startTime;
    let endTime = this.endTime;
    let chartAttr = this.chartAttr;
    let minValue = this.minValue;
    let maxValue = this.maxValue;
    let plots = this.plots;
    let theme = this.theme;
    let xAxisFormat = config.xAxis.tick.format;
    let yAxisFormat = config.yAxis.tick.format;
    let diff = endTime - startTime;
    let maxValueWidth = this.maxValueWidth;
    const { plotLine: xPlotLine, axisLine: xAxisLine, timeDiff } = config.xAxis;
    const { plotLine: yPlotLine, axisLine: yAxisLine, textPosition } = config.yAxis;

    const xOptions = {
      format: xAxisFormat || calculateFormat(diff),
      minOffset: 3,
      chartAttr,
      startTime,
      endTime,
      xPlotLine,
      xAxisLine,
      theme,
      tick: config.xAxis.tick,
    };
    const yOptions = {
      format: yAxisFormat,
      minValue,
      maxValue,
      maxValueWidth,
      chartAttr,
      yPlotLine,
      yAxisLine,
      plots,
      theme,
      textPosition,
      tick: config.yAxis.tick,
      tickAttribute: this.tickAttribute,
    };

    /**
     * Plot gridline
     */
    // if (config.xAxis.plotLine.display) drawXplot(ctx, xOptions);
    // if (config.yAxis.plotLine.display) drawYplot(ctx, yOptions);

    /**
     * Tick labels: xAxis & yAxis
     */
    if (config.xAxis.tick.display) {
      drawXtick(ctx, xOptions);
    }
    if (config.yAxis.tick.display) {
      drawYtick(ctx, yOptions);
    }

    /**
     * Outer gridline & Tick labels
     */
    if (config.xAxis.axisLine.display) {
      drawXaxis(ctx, xOptions);
    }
    if (config.yAxis.axisLine.display) {
      drawYaxis(ctx, yOptions);
    }
  };

  _drawMouseDrag = () => {
    const ctx = this.ctx;
    const { x1, x2 } = this.mouseAttr;
    const { h, y } = this.chartAttr;

    if (Math.abs(x1 - x2) <= 3) {
      return;
    }

    ctx.save();
    /**
     * Draw Starting Line
     */
    let BLOCK_SIZE = x1 > x2 ? 4 : -4;
    const BLOCK_HEIGHT = h / 3;
    const radius = Math.floor(BLOCK_HEIGHT / 10);

    ctx.beginPath();
    ctx.strokeStyle = '#979797';
    ctx.fillStyle = '#242830';
    ctx.moveTo(x1, y + BLOCK_HEIGHT);
    ctx.arcTo(x1 + BLOCK_SIZE, y + BLOCK_HEIGHT, x1 + BLOCK_SIZE, y + BLOCK_HEIGHT + radius, 4);
    ctx.lineTo(x1 + BLOCK_SIZE, y + BLOCK_HEIGHT * 2 - radius);
    ctx.arcTo(x1 + BLOCK_SIZE, y + BLOCK_HEIGHT * 2, x1, y + BLOCK_HEIGHT * 2, 4);
    ctx.fill();
    ctx.stroke();
    // ctx.beginPath();
    // ctx.strokeStyle = "rgba(255, 196, 0, 0.9)";
    // ctx.moveTo(x1, y);
    // ctx.lineTo(x1, y + h);
    // ctx.stroke();
    // ctx.closePath();

    /**
     * Color Rectangle Within
     */
    ctx.fillStyle = 'rgba(36, 40, 48, 0.4)';
    ctx.fillRect(x1, y, x2 - x1, h);

    /**
     * Draw Ending Line
     */
    // ctx.beginPath();
    // ctx.strokeStyle = "rgba(255, 196, 0, 0.9)";
    // ctx.moveTo(x2, y);
    // ctx.lineTo(x2, y + h);
    // ctx.stroke();

    ctx.closePath();

    ctx.restore();
  };

  _bringFocusFront = () => {
    let en = this.data.keys();
    while (en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);

      if (this.focused && this.focused.length > 0 && this.focused.find((fc) => fc.id === value.id)) {
        this.data.remove(key);
        this.data.putLast(key, value);
        break;
      }
    }
  };
}

export default WChart;
