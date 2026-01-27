/**
 * WhaTap BarChart
 * All rights reserved to WhaTap Labs 2018
 */
import { CoreFunc } from '../../core';
import { drawXaxis, drawXtick, drawYaxis, drawYplot, drawYtick } from '../core/core.BarChart';
import { getChartAttr } from '../core/core.WChart';
import Tooltip from '../helper/drawTooltip';
import { getMousePos } from '../helper/mouseEvt';
import { FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import { getScreenRatio } from '../util/displayModulator';
import { calculatePlots, getMaxValue, tooltipCalcX, tooltipRange } from '../util/positionCalc';
import AbstractChart from './AbstractChart';

const BAR_WIDTH = 20;
const BAR_MARGIN = 4;

class BarChart extends AbstractChart {
  constructor(bindId, options) {
    super(bindId, options);

    this.hoveredDot = null;
    this.selectedDot = null;

    this.initCanvas();
  }

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
    this.chartAttr = getChartAttr(this);
    this.minValue = 0;

    this.initListener();
  };

  setTheme = (theme) => {
    if (typeof theme === 'undefined' || this.themePalette[theme] === 'undefined') {
      theme = 'wh';
    }

    this.theme = this.themePalette[theme];
    this.themeId = theme;
    this.drawChart();
  };

  loadData = (dataset) => {
    let that = this;
    let themeId = this.themeId;

    if (!dataset && dataset.length === 0) {
      return;
    }
    let maxValue = 1;
    let maxValueIndex = 0;

    this.data.clear();
    const length = dataset.length;
    const tempPercent = 100 / length / 2;
    let xPos = 0;
    dataset.map((ds, idx) => {
      if (idx === 0 || idx === length) {
        xPos += tempPercent;
      } else {
        xPos += tempPercent * 2;
      }
      this.data.put(ds.key, {
        xPos: xPos,
        data: ds.data.map((bar, index) => {
          let colorValue = that.palette.getColorFromId(bar.id, themeId);
          let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
          let fillValue = CoreFunc.formatRgb(colorValue.rgb, 0.2);
          if (maxValue <= bar.data) {
            maxValue = bar.data;
            maxValueIndex = idx;
          }

          if (bar.color) {
            strokeValue = bar.color;
          }
          return {
            ...bar,
            color: strokeValue,
            fill: fillValue,
          };
        }),
      });
    });

    this.chartMaxValue = maxValue;
    this.chartMaxIndex = maxValueIndex;

    this.drawChart();
  };

  drawChart = () => {
    this.ctx.clearRect(0, 0, this.bcRect.width, this.bcRect.height);
    this.setDrawTools();
    this.drawBackground();
    this.drawData();
    this.drawPostBackground();
  };

  setDrawTools = () => {
    const ctx = this.ctx;
    ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
    this.plots = calculatePlots(this.chartAttr.h);
    this.maxValue = getMaxValue(this.chartMaxValue || 10, this.plots);
    this.maxValueWidth = parseInt(ctx.measureText(this.maxValue).width);
    this.chartAttr = getChartAttr(this);
  };

  drawBackground = () => {
    const { ctx, chartAttr, plots, theme } = this;
    const config = this.config;

    // yAxis.plotLine.display가 false가 아닌 경우에만 plotLine 그리기
    if (config.yAxis.plotLine?.display !== false) {
      drawYplot(ctx, { chartAttr, plots, theme });
    }
  };

  drawPostBackground = () => {
    const ctx = this.ctx;
    const config = this.config;

    const { plotLine: yPlotLine, axisLine: yAxisLine } = config.yAxis;
    const yOptions = {
      format: config.yAxis.tick.format,
      minValue: this.minValue,
      maxValue: this.maxValue,
      maxValueWidth: this.maxValueWidth,
      chartAttr: this.chartAttr,
      yPlotLine,
      yAxisLine,
      plots: this.plots,
      theme: this.theme,
      tick: config.yAxis.tick,
    };

    drawYtick(ctx, yOptions);
    drawYaxis(ctx, yOptions);

    const xOptions = {
      data: this.data,
      chartAttr: this.chartAttr,
      tick: config.yAxis.tick,
      theme: this.theme,
      format: config.xAxis.tick.format,
    };
    drawXtick(ctx, xOptions);
    drawXaxis(ctx, xOptions);
  };

  drawData = () => {
    //
    //
    let ctx = this.ctx;
    let maxValue = this.maxValue;
    let config = this.config;
    let _dots = [];

    const { x, y, w, h } = this.chartAttr;
    const dataWidth = w / this.data.count - (this.config.common.barMargin ? this.config.common.barMargin : BAR_MARGIN);

    ctx.save();
    ctx.font = `11px ${FONT_TYPE}`;
    ctx.textAlign = 'center';
    let en = this.data.keys();
    let index = 0;

    while (en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);
      const xPos = x + (value.xPos / 100) * w;
      const xStart = xPos - dataWidth / 2;
      const barWidth = dataWidth / value.data.length;

      let xPosDraw = xStart;
      value.data.map((data, idx) => {
        ctx.save();
        ctx.beginPath();

        const height = h * (data.data / maxValue);
        const yStart = y + h - height;
        const thisDot = {
          xStart: xPosDraw,
          xEnd: xPosDraw + barWidth,
          yStart: yStart,
          yEnd: yStart + height,
          data: data,
          key: key,
        };
        _dots.push(thisDot);

        // chartMouseClick이 있을 때만 배경 하이라이트 그리기
        if (this.chartMouseClick) {
          const selectGroupOnClick = config.common.selectGroupOnClick;

          const isHovered =
            this.hoveredDot &&
            (selectGroupOnClick
              ? this.hoveredDot.key === key
              : this.hoveredDot.key === key && this.hoveredDot.data.id === data.id);

          const isSelected =
            this.selectedDot &&
            (selectGroupOnClick
              ? this.selectedDot.key === key
              : this.selectedDot.key === key && this.selectedDot.data.id === data.id);

          if (isHovered || isSelected) {
            ctx.save();
            ctx.fillStyle = isSelected ? 'rgba(128, 128, 128, 0.2)' : 'rgba(128, 128, 128, 0.05)';

            ctx.fillRect(xPosDraw, y, barWidth, h);
            ctx.restore();
          }
        }

        ctx.fillStyle = data.color;
        ctx.fillRect(xPosDraw, yStart, barWidth, height);
        if (config.common.plotMaxValue !== true || (index === this.chartMaxIndex && data.data === this.chartMaxValue)) {
          ctx.fillText(
            config.common.dataFormat ? config.common.dataFormat(data.data) : data.data,
            xPosDraw + barWidth / 2,
            yStart - 4,
          );
        }
        xPosDraw += barWidth;

        ctx.restore();
      });

      index++;
    }

    this.dots = _dots;

    ctx.restore();
  };

  findTooltipData = (mousePos) => {
    const x = mousePos.mx;
    const y = mousePos.my;
    const dotLength = this.dots.length;
    const chartAttr = this.chartAttr;
    let select = false;

    for (let i = 0; i < dotLength; i++) {
      const dot = this.dots[i];
      if (x >= dot.xStart && x <= dot.xEnd && y >= chartAttr.y && y <= dot.yEnd) {
        select = dot;
        break;
      }
    }

    return select;
  };

  getTooltipText = (dot) => {
    const config = this.config;
    if (dot) {
      const key = dot.key;
      const data = dot.data;

      if (config.tooltip.format) {
        return '<div>' + config.tooltip.format(key, data) + '</div>';
      }

      return `<div>${key}: ${data.data}</div>`;
    }

    return false;
  };

  initListener = () => {
    this.tooltip = new Tooltip();
    this.canvas.addEventListener('mouseover', this.handleMouseOver);
    this.canvas.addEventListener('click', this.handleMouseClick);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseout', this.handleMouseOut);
  };

  handleMouseClick = (evt) => {
    let mousePos = getMousePos(evt, this.overrideClientRect());
    let dot = this.findTooltipData(mousePos);

    if (dot && this.chartMouseClick) {
      this.selectedDot = dot;
      this.drawChart();

      this.chartMouseClick(dot);
    }
  };

  handleMouseOver = (evt) => {
    let canvas = this.canvas;
    let ctx = this.ctx;
    let mousePos = getMousePos(evt, this.overrideClientRect());
    let dot = this.findTooltipData(mousePos);
    const text = this.getTooltipText(dot);

    if (text) {
      canvas.style.cursor = 'pointer';
      this.mouseFollow = true;
      this.tooltip.append(evt, text);
    }
  };

  handleMouseMove = (evt) => {
    let mousePos = getMousePos(evt, this.overrideClientRect());
    let canvas = this.canvas;
    let dot = this.findTooltipData(mousePos);

    if (this.chartMouseClick) {
      const config = this.config;
      const selectGroupOnClick = config.common.selectGroupOnClick;

      // 그룹 모드와 non-그룹 모드 모두 key와 data.id로 비교
      const isDifferent = this.hoveredDot?.key !== dot?.key || this.hoveredDot?.data?.id !== dot?.data?.id;

      if (isDifferent) {
        this.hoveredDot = dot;
        this.drawChart();
      }
    }

    const text = this.getTooltipText(dot);
    if (text) {
      canvas.style.cursor = 'pointer';
      this.mouseFollow = true;
      if (this.tooltip.tooltipOn) {
        this.tooltip.follow(evt, text);
      } else {
        this.tooltip.append(evt, text);
      }
    } else {
      if (this.mouseFollow) {
        canvas.style.cursor = 'default';
        this.mouseFollow = false;
        this.tooltip.remove();
      }
    }
  };

  handleMouseOut = (evt) => {
    let canvas = this.canvas;
    canvas.style.cursor = 'default';
    this.mouseFollow = false;
    this.tooltip.remove();

    if (this.chartMouseClick && this.hoveredDot) {
      this.hoveredDot = null;
      this.drawChart();
    }

    this.hoveredPlots = false;

    this.drawChart();
  };
}

export default BarChart;
