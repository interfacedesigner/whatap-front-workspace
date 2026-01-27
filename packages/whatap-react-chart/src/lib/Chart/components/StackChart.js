/**
 * WhaTap StackChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import { CoreFunc } from '../../core';
import { definePlotCount, getChartAttr } from '../core/core.WChart';
import { drawHorizontalLine } from '../helper/drawBorder';
import { drawTooltipCircle } from '../helper/drawTooltip';
import { calculateStackPos, tooltipCalcX, tooltipRange } from '../util/positionCalc';
import { getMaxValue } from '../util/positionCalc';
import WChart from './WChart';

class StackChart extends WChart {
  constructor(bindId, options) {
    super(bindId, options);
  }

  loadData = (dataset) => {
    if (!dataset && dataset.length === 0) {
      return;
    }

    let that = this;
    let config = this.config;
    this.chartAttr = getChartAttr(this);
    let plots = definePlotCount(config, this.chartAttr.h);
    let themeId = this.themeId;
    this.maxPlot = config.xAxis.maxPlot;
    const { minValue, maxValue, fixedMin, fixedMax } = config.yAxis;
    const { plotMaxValue } = config.common;

    this.minValue = minValue;
    this.maxValue = maxValue;
    this.maxValueData = [0, 0];

    let maxData = [];
    let maxPlotCnt = 0;

    if (dataset.length > 0) {
      let timeLimits = [];

      /**
       * [[timestamp, value], [timestamp, value], ...]
       */
      let stackedTimestamps = [];
      dataset.map((ds, idx) => {
        if (ds.data) {
          ds.data.map((datum) => {
            const exists = stackedTimestamps.find((stamp) => stamp[0] === datum[0]);
            if (exists) {
              exists[1] += datum[1];
            } else {
              stackedTimestamps.push([...datum]);
            }
          });
        }
      });

      stackedTimestamps.map((timestamp) => {
        // /**
        //  * If not fixed Minimum / Maximum value, evaluate the data within and decide the max/min value
        //  */
        // maxData[idx] = [0, 0];
        // if(plotMaxValue && typeof timestamp[1] === 'number' && data[1] >= maxData[idx][1]){
        //   maxData[idx] = data;
        // }
        if (!fixedMax && typeof timestamp[1] === 'number' && timestamp[1] > that.maxValue) {
          that.maxValue = getMaxValue(timestamp[1], plots);
        }
        if (!fixedMin && typeof timestamp[1] === 'number' && timestamp[1] < that.minValue) {
          that.minValue = timestamp[1];
        }
      });

      this.data.clear();
      dataset.map((ds, idx) => {
        let colorValue = that.palette.getColorFromId(ds.id, themeId);
        let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
        let fillValue = CoreFunc.formatRgb(colorValue.rgb, 0.2);

        /**
         * Sorts the inner data in ascending order.
         */
        if (!ds.data) {
          that.data.put(ds.key, { id: ds.id, label: ds.label, data: [], color: strokeValue, fill: fillValue });
          return;
        }
        that.heapSort.sort(ds.data, false, 0);

        if (ds.data.length > maxPlotCnt) {
          maxPlotCnt = ds.data.length;
        }

        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data, color: strokeValue, fill: fillValue });
        /**
         * Only get the initial start time when the option is set to `isFixed=false`
         */
        if (!config.xAxis.isFixed && ds.data.length > 0) {
          let timeStartEnd = that.getStartEndTime(ds.data, true);
          timeLimits.push(timeStartEnd);
        }

        if (typeof that.maxPlot === 'undefined') {
          that.maxPlot = maxPlotCnt;
        }
      });

      // if(plotMaxValue && maxData.length){
      //   maxData.map((data, idx) => {
      //     if(data[1] > this.maxValueData[1] || (data[1] === this.maxValueData[1] && data[0] > this.maxValueData[0])){
      //       this.maxValueData = data;
      //     }
      //   })
      // }

      if (!config.xAxis.isFixed && timeLimits.length > 0) {
        this.setTimeStandard(timeLimits);
      }
    }
    that.drawChart();
  };

  findTooltipData = (pos) => {
    const { mx, my } = pos;
    let that = this;
    let ctx = this.ctx;
    let startTime = this.startTime;
    let endTime = this.endTime;
    let xStart = this.chartAttr.x;
    let xEnd = this.chartAttr.x + this.chartAttr.w;
    let config = this.config;
    let textOutput = '';

    let timeValue = tooltipCalcX(startTime, endTime, xStart, xEnd, mx);

    let ttRange = 1000;
    if (this.dots.length > 1) {
      ttRange = tooltipRange(this.dots);
    }

    let tooltipList = [];
    for (let i = 0; i < this.dots.length; i++) {
      let dot = this.dots[i];
      if (dot.time > timeValue - ttRange / 2 && dot.time < timeValue + ttRange / 2) {
        tooltipList.push(dot);
      }
    }

    if (this.focused && this.focused.length > 0) {
      let currentDot = tooltipList.filter((el) => {
        let dot = that.focused.find((fc) => fc.id === el.id);
        if (dot) {
          return dot;
        }
      });
      tooltipList = currentDot;
    } else if (!config.tooltip.selectAll && tooltipList.length > 0) {
      let currentDot = tooltipList[0];
      tooltipList.map((el) => {
        if (Math.abs(el.y - my) < Math.abs(currentDot.y - my)) {
          currentDot = el;
        }
      });
      tooltipList = [currentDot];
    }

    if (tooltipList.length !== 0) {
      if (config.tooltip && config.tooltip.customTooltip) {
        /**
         * Apply any custom tooltip if provided
         */
        textOutput = config.tooltip.customTooltip(tooltipList);
      } else {
        let timestamp = config.tooltip.time.format(tooltipList[0].time);
        let maxTooltipWidth = parseInt(ctx.measureText(timestamp).width) || 0;
        let maxLabelWidth = 0;
        let maxValueWidth = 0;

        /**
         * In the case of Stack Charts, the order must be reversed.
         */
        tooltipList.reverse();
        let list = tooltipList.map((ttl, idx) => {
          let tooltipWidth = 0;
          let labelWidth = 0;
          let valueWidth = 0;
          if (ttl.label) {
            labelWidth = parseInt(ctx.measureText(`${ttl.label}`).width);
          }
          if (config.tooltip.value.format) {
            valueWidth = parseInt(ctx.measureText(config.tooltip.value.format(ttl.value)).width);
          } else {
            valueWidth = parseInt(ctx.measureText(`${ttl.value.toFixed(1)}`).width);
          }
          tooltipWidth = labelWidth + valueWidth;
          if (labelWidth > maxLabelWidth) {
            maxLabelWidth = labelWidth;
          }
          if (valueWidth > maxValueWidth) {
            maxValueWidth = valueWidth;
          }
          if (tooltipWidth > maxTooltipWidth) {
            maxTooltipWidth = tooltipWidth;
          }

          return {
            label: ttl.label,
            value: ttl.value,
            colorLabel: drawTooltipCircle(ttl.color),
          };
        });

        let timeEl = `<div style='display: block; text-align: center; padding-left: 1px; padding-right: 1px;'>${timestamp}</div>`;

        let fontType = '"Helvetica Neue", "Helvetica", "Arial", sans-serif';
        textOutput += `<div style='font-family: ${fontType}'>`;
        textOutput += timeEl;

        let length = list.length;
        const ROW_COUNT = 15;
        let columns = Math.ceil(length / ROW_COUNT);
        let widthRatio = 100 / columns;
        textOutput += `<div style='display: flex;'>`;

        for (let i = 0; i < length; i++) {
          let ttl = list[i];

          if (i % ROW_COUNT === 0) {
            textOutput += `<div style='display: inline-block; width: ${widthRatio}%;'>`;
          }

          let out = `<div style='text-align: center; padding-left: 5px; padding-right: 5px; '>
                      ${ttl.colorLabel}
                      ${
                        ttl.label
                          ? `<div style='display: inline-block; width: ${maxLabelWidth}px; text-align: left;'>
                            ${ttl.label}
                          </div><div style='display: inline-block;'>:</div>`
                          : `<div style='display: inline-block;'></div>`
                      }
                      <div style='display: inline-block; width: ${maxValueWidth}px; text-align: right;'>
                        ${config.tooltip.value.format(ttl.value)}  
                      </div>
                    </div>`;
          textOutput += out;

          if ((i + 1) % ROW_COUNT === 0) {
            textOutput += '</div>';
          }
        }
        textOutput += '</div>';
        textOutput += '</div>';
        textOutput += '</div>';
      }
      return textOutput;
    } else {
      return null;
    }
  };

  findPlotPoint = (pos) => {
    const { mx, my } = pos;
    let that = this;
    let ctx = this.ctx;
    let startTime = this.startTime;
    let endTime = this.endTime;
    let xStart = this.chartAttr.x;
    let xEnd = this.chartAttr.x + this.chartAttr.w;
    let config = this.config;
    let plotPoint = this.plotPoint;

    let timeValue = tooltipCalcX(startTime, endTime, xStart, xEnd, mx);

    let ttRange = 1000;
    if (this.dots.length > 1) {
      ttRange = tooltipRange(this.dots);
    }

    let tooltipList = [];
    for (let i = 0; i < this.dots.length; i++) {
      let dot = this.dots[i];
      if (dot.time > timeValue - ttRange / 2 && dot.time < timeValue + ttRange / 2) {
        tooltipList.push(dot);
      }
    }

    if (this.focused && this.focused.length > 0) {
      let currentDot = tooltipList.filter((el) => {
        let dot = that.focused.find((fc) => fc.id === el.id);
        if (dot) {
          return dot;
        }
      });
      tooltipList = currentDot;
    } else if (!config.tooltip.selectAll && tooltipList.length > 0) {
      let currentDot = tooltipList[0];
      tooltipList.map((el) => {
        if (Math.abs(el.y - my) < Math.abs(currentDot.y - my)) {
          currentDot = el;
        }
      });
      tooltipList = [currentDot];
    }

    if (tooltipList.length !== 0) {
      this.hoveredPlots = tooltipList;
      return true;
    } else {
      this.hoveredPlots = [];
      return false;
    }
  };

  getStartEndTime = (data) => {
    let config = this.config;
    let timeDiff = config.xAxis.timeDiff;

    let dataStartTime = data[0][0];
    let dataEndTime = data[0][0];

    let length = data.length;
    let interval = timeDiff;

    if (length > 1) {
      interval = data[1][0] - data[0][0];
    }

    for (let i = 1; i < length; i++) {
      if (dataStartTime > data[i][0]) {
        dataStartTime = data[i][0];
      }
      if (dataEndTime < data[i][0]) {
        dataEndTime = data[i][0];
      }
      let plotDiff = data[i][0] - data[i - 1][0];
      if (plotDiff < interval) {
        interval = plotDiff;
      }
    }

    return { start: dataStartTime, end: dataEndTime, plotDiff: interval };
  };

  setTimeStandard = (limits) => {
    let config = this.config;
    let { timeDiff } = config.xAxis;

    let length = limits.length;
    let dataStart = limits[0].start;
    let dataEnd = limits[0].end;
    let interval = limits[0].plotDiff;

    for (let i = 1; i < length; i++) {
      let limit = limits[i];
      if (dataStart > limit.start) {
        dataStart = limit.start;
      }
      if (dataEnd < limit.end) {
        dataEnd = limit.end;
      }
      if (interval > limit.plotDiff) {
        interval = limit.plotDiff;
      }
    }

    this.endTime = dataEnd;
    this.startTime = this.endTime - timeDiff;

    if (this.startTime < dataStart) {
      this.startTime = dataStart;
    }
  };

  updateData = (dataset) => {
    if (!dataset || !Array.isArray(dataset)) {
      return;
    }
    let that = this;
    let config = this.config;
    this.chartAttr = getChartAttr(this);
    let plots = definePlotCount(config, this.chartAttr.h);
    let themeId = this.themeId;
    const { fixedMin, fixedMax } = config.yAxis;

    let currentMax = 0;
    let currentMin = 0;

    dataset.map((ds, idx) => {
      if (that.data.containsKey(ds.key) && that.data.get(ds.key).data) {
        let cData = that.data.get(ds.key);
        ds.data.map((datum) => {
          let hasData = cData.data.find((d) => {
            return datum[0] === d[0];
          });

          if (typeof hasData !== 'undefined') {
            switch (config.common.identicalDataBehavior) {
              case 'avg':
                hasData[1] = (hasData[1] + datum[1]) / 2;
                break;
              case 'sum':
                hasData[1] += datum[1];
                break;
              case 'replace':
                hasData[1] = datum[1];
                break;
              case 'none':
              default:
                cData.data.push(datum);
                break;
            }
          } else {
            cData.data.push(datum);
          }
        });

        if (cData.data) {
          that.heapSort.sort(cData.data, false, 0);
        }
      } else {
        let colorValue = that.palette.getColorFromId(ds.id, themeId);
        let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
        let fillValue = CoreFunc.formatRgb(colorValue, 0.2);
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data1, color: strokeValue, fill: fillValue });
      }
    });

    let en = this.data.keys();
    let idx = 0;
    let timeLimits = [];
    for (let idx = 0; en.hasMoreElements(); idx++) {
      let key = en.nextElement();
      let value = this.data.get(key);

      /**
       * V0.8.4
       * (Bug fix) value가 undefined로 넘어오는 경우에 대한 fix
       */
      if (value.data) {
        if (value.data.length > this.maxPlot) {
          let overflow = value.data.length - this.maxPlot;
          value.data = value.data.slice(overflow);
        }
        // that.setTimeStandard(value.data, idx);
        if (value.data.length > 0) {
          let timeStartEnd = this.getStartEndTime(value.data);
          timeLimits.push(timeStartEnd);

          /**
           * V0.8.6
           * (Bug fix) value가 한 번 올라간 다음에 다시 내려가지 않는 문제에 대한 fix
           */
          value.data.map((vd) => {
            if (vd[1] > currentMax) {
              currentMax = vd[1];
            }
            if (vd[1] < currentMin) {
              currentMin = vd[1];
            }
          });
        }
      }
    }
    /**
     * V0.8.6
     * (Bug fix) value가 한 번 올라간 다음에 다시 내려가지 않는 문제에 대한 fix
     */
    if (!fixedMax && currentMax !== 0) {
      this.maxValue = getMaxValue(currentMax, plots);
    }
    if (!fixedMin && currentMin !== 0) {
      this.minValue = currentMin;
    }

    if (timeLimits.length > 0) {
      this.setTimeStandard(timeLimits);
    }

    this.drawChart();
  };

  /**
   * @private
   */
  drawData = () => {
    let that = this;
    let ctx = this.ctx;
    let startTime = this.startTime;
    let endTime = this.endTime;
    let config = this.config;
    let theme = this.theme;
    let plotPoint = this.plotPoint;
    let hoveredPlots = this.hoveredPlots;

    const { disconnectThreshold, area, plotMaxValue } = config.common;
    const { x, y, w, h } = this.chartAttr;

    ctx.save();

    let _dots = [];
    let en = this.data.keys();
    let maxValueDot = false;
    while (en.hasMoreElements()) {
      let key = en.nextElement();
      let value = this.data.get(key);
      let prevTimestamp = 0;
      let prevXCoord = 0;
      let prevYCoord = 0;

      /**
       * V0.8.4
       * (Bug fix) value가 undefined로 넘어오는 경우에 대한 fix
       */
      let length = (value.data && value.data.length) || 0;
      let lineInit = false;
      for (let i = 0; i < length; i++) {
        let datum = value.data[i];
        if (datum[0] < startTime) {
          continue;
        }

        let xPos = (datum[0] - startTime) / (endTime - startTime);
        let xCoord = x + w * xPos;

        let yPos = calculateStackPos(datum[1], this.minValue, this.maxValue);
        let yCoord = y + h * yPos;

        /**
         * plot과 plot을 이어주는 line
         */
        ctx.lineWidth = 1.5;

        const thisDot = {
          key: key,
          id: value.id,
          label: value.label,
          color: value.color,
          fill: value.fill,
          x: xCoord,
          y: yCoord,
          xPos: xPos,
          yPos: yPos,
          r: 5,
          offset: 3,
          time: datum[0],
          value: datum[1],
        };

        /**
         * Stack Calculation Module
         */
        const stackedDots = _dots.filter((dot) => dot.xPos === thisDot.xPos);
        if (stackedDots && stackedDots.length > 0) {
          let stackedValue = datum[1];
          stackedDots.map((dot) => {
            stackedValue += dot.value;
          });
          thisDot.yPos = calculateStackPos(stackedValue, this.minValue, this.maxValue);
          thisDot.y = y + h * thisDot.yPos;
        }
        /**
         * This operation will inverse the drawing operation
         * Original(source-over): New image overrides the old
         * Changed(destination-over): New image is sent to the background
         */
        ctx.globalCompositeOperation = 'destination-over';

        if (!lineInit) {
          ctx.beginPath();

          ctx.strokeStyle = value.color;
          if (this.focused && this.focused.length > 0 && this.focused.find((fc) => fc.id !== value.id)) {
            ctx.strokeStyle = theme.unselected;
          }
          ctx.moveTo(thisDot.x, thisDot.y);
          lineInit = true;
        } else {
          if (datum[0] - prevTimestamp < disconnectThreshold) {
            ctx.lineTo(thisDot.x, thisDot.y);
            ctx.stroke();

            if (area === true) {
              ctx.save();

              ctx.beginPath();
              ctx.moveTo(prevXCoord, prevYCoord);
              ctx.lineTo(prevXCoord, y + h);
              ctx.lineTo(thisDot.x, y + h);
              ctx.lineTo(thisDot.x, thisDot.y);
              ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.fill();
              ctx.closePath();

              ctx.beginPath();
              ctx.moveTo(prevXCoord, prevYCoord);
              ctx.lineTo(prevXCoord, y + h);
              ctx.lineTo(thisDot.x, y + h);
              ctx.lineTo(thisDot.x, thisDot.y);
              ctx.fillStyle = value.fill;
              ctx.fill();
              ctx.closePath();

              ctx.restore();
            }
          } else {
            ctx.closePath();
          }

          ctx.beginPath();
          ctx.moveTo(thisDot.x, thisDot.y);
        }

        // if(plotMaxValue && this.maxValueData[0] && !maxValueDot && this.maxValueData[0] === datum[0] && this.maxValueData[1] === datum[1]){
        //   maxValueDot = thisDot;
        // }

        _dots.push(thisDot);

        prevTimestamp = datum[0];
        prevXCoord = thisDot.x;
        prevYCoord = thisDot.y;
      }
    }

    if (plotPoint && hoveredPlots[0] && config.common.plotVerticalLine) {
      ctx.save();
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = '#666666';
      ctx.beginPath();
      ctx.moveTo(hoveredPlots[0].x, y);
      ctx.lineTo(hoveredPlots[0].x, y + h);
      ctx.stroke();
      ctx.restore();
    }

    const drawDot = (dot) => {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
      ctx.fillStyle = dot.color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();
    };

    if (plotPoint && hoveredPlots.length > 0) {
      hoveredPlots.map((pl) => {
        drawDot(pl);
      });
    }

    if (config.yAxis.horizontalLine !== false) {
      drawHorizontalLine(ctx, {
        minValue: this.minValue,
        maxValue: this.maxValue,
        horizontalLine: config.yAxis.horizontalLine,
        chartAttr: this.chartAttr,
        hoveredPlots: hoveredPlots,
      });
    }

    // if(plotMaxValue && (!this.focused || this.focused.length === 0) && maxValueDot){
    //   ctx.beginPath();
    //   ctx.arc(maxValueDot.x, maxValueDot.y, maxValueDot.r + 1, 0, 2 * Math.PI);
    //   ctx.fillStyle = maxValueDot.color;
    //   ctx.fill();
    //   ctx.beginPath();
    //   ctx.arc(maxValueDot.x, maxValueDot.y, maxValueDot.r - 1, 0, 2 * Math.PI);
    //   ctx.strokeStyle = "#ffffff";
    //   ctx.lineWidth = 1;
    //   ctx.stroke();
    // }

    this.dots = _dots;
    ctx.restore();
  };
}

export default StackChart;
