/**
 * WhaTap LineChart
 * created by MinGu Lee (@immigration9)
 * All rights reserved to WhaTap Labs 2018
 */
import { CoreFunc } from '../../core';
import { definePlotCount, getChartAttr } from '../core/core.WChart';
import { drawArea, drawFocus, drawHorizontalLine } from '../helper/drawBorder';
import { drawTooltipCircle } from '../helper/drawTooltip';
import { getMaxValue } from '../helper/helper.value';
import { tooltipCalcX, tooltipRange } from '../util/positionCalc';
import WChart from './WChart';

class LineChart extends WChart {
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
    this.dataMaxValue = 0;
    this.dataMinValue = Infinity;
    const { minValue, maxValue, fixedMin, fixedMax } = config.yAxis;
    const { plotMaxValue } = config.common;

    if (minValue) {
      this.minValue = minValue;
    }

    if (maxValue) {
      this.maxValue = maxValue;
    }
    this.maxValueData = [0, 0];

    let maxData = [];
    let maxPlotCnt = 0;

    if (dataset.length > 0) {
      let timeLimits = [];

      this.data.clear();
      dataset.map((ds, idx) => {
        let colorValue = that.palette.getColorFromId(ds.id, themeId);
        let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
        let fillValue = CoreFunc.formatRgb(colorValue.rgb, 0.7);

        /**
         * Sorts the inner data in ascending order.
         */
        if (!ds.data) {
          that.data.put(ds.key, {
            id: ds.id,
            label: ds.label,
            data: [],
            color: strokeValue,
            fill: fillValue,
            rowData: ds,
          });
          return;
        }

        that.heapSort.sort(ds.data, false, 0);

        /**
         * Cropping method for when data received is 0.
         */
        /**
         * V0.9.16
         * (Bug fix) 작동에 문제가 있어 삭제
         */
        // if (ds.data.length > 5) {
        //   let dsLength = ds.data.length;
        //   for (let i = dsLength - 1; i > dsLength - 5; i--) {
        //     if (ds.data[i]) {
        //       if (ds.data[i][1] === 0) {
        //         ds.data.splice(i, 1);
        //       }
        //     }
        //   }
        // }

        /**
         * If not fixed Minimum / Maximum value, evaluate the data within and decide the max/min value
         */
        maxData[idx] = [0, 0];
        ds.data.map((data) => {
          if (this.dataMaxValue < data[1]) {
            this.dataMaxValue = data[1];
          }

          if (this.dataMinValue > data[1]) {
            this.dataMinValue = data[1];
          }

          if (plotMaxValue && typeof data[1] === 'number' && data[1] >= maxData[idx][1]) {
            maxData[idx] = data;
          }
          if (!fixedMax && typeof data[1] === 'number' && data[1] > that.maxValue && !config.yAxis.tickFocusValue) {
            that.tickAttribute = getMaxValue(
              data[1],
              plots,
              that.config.yAxis.unitDivider,
              that.config.yAxis.integerOnly,
            );
            that.maxValue = that.tickAttribute.maxValue;
          }
          if (!fixedMin && typeof data[1] === 'number' && data[1] < that.minValue) {
            that.minValue = data[1];
          }
        });

        if (ds.data.length > maxPlotCnt) {
          maxPlotCnt = ds.data.length;
        }

        that.data.put(ds.key, {
          id: ds.id,
          label: ds.label,
          data: ds.data,
          color: strokeValue,
          fill: fillValue,
          rowData: ds,
        });
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

      if (config.yAxis.tickFocusValue && this.dataMaxValue > 0 && this.dataMinValue < Infinity) {
        let f = 0;

        let value = this.dataMaxValue;
        while (value % 1 !== 0) {
          value = value * 10;
          f++;
        }

        value = this.dataMinValue * Math.pow(10, f);
        while (value % 1 !== 0) {
          value = value * 10;
          f++;
        }

        const powValue = Math.pow(10, f);
        let maxValue = Math.floor(this.dataMaxValue * powValue);
        const minValue = Math.floor(this.dataMinValue * powValue);
        if (minValue === maxValue) {
          maxValue += 1;
        }

        const duration = maxValue - minValue;
        const dPowValue = Math.pow(10, Math.floor(Math.log10(duration) + 1));
        this.dataMinValue = Math.floor(minValue / dPowValue) * dPowValue;
        this.dataMaxValue = this.dataMinValue + getMaxValue(duration, this.plots || 4).maxValue;

        this.minValue = this.dataMinValue = this.dataMinValue / powValue;
        this.maxValue = this.dataMaxValue = this.dataMaxValue / powValue;
      } else {
        this.dataMaxValue = false;
        this.dataMinValue = false;
      }

      if (plotMaxValue && maxData.length) {
        maxData.map((data, idx) => {
          if (data[1] > this.maxValueData[1] || (data[1] === this.maxValueData[1] && data[0] > this.maxValueData[0])) {
            this.maxValueData = data;
          }
        });
      }

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

      if (config.tooltip.selectPattern) {
        const pattern = config.tooltip.selectPattern;
        tooltipList = tooltipList.filter((el) => {
          return currentDot[pattern] === el[pattern];
        });
      } else {
        tooltipList = [currentDot];
      }
    }

    if (tooltipList.length !== 0) {
      if (config.tooltip && config.tooltip.customTooltip) {
        /**
         * Apply any custom tooltip if provided
         */
        textOutput = config.tooltip.customTooltip(tooltipList);
      } else {
        let timestamp = config.tooltip.time.format(tooltipList[0].time, this.tickAttribute, tooltipList);
        let maxTooltipWidth = parseInt(ctx.measureText(timestamp).width) || 0;
        let maxLabelWidth = 0;
        let maxValueWidth = 0;

        let list = tooltipList.map((ttl, idx) => {
          let tooltipWidth = 0;
          let labelWidth = 0;
          let valueWidth = 0;
          if (ttl.labelByPlot) {
            labelWidth = parseInt(
              ctx.measureText(`${config.tooltip.label.format(ttl.labelByPlot, this.tickAttribute, ttl)}`).width,
            );
          } else if (ttl.label) {
            labelWidth = parseInt(
              ctx.measureText(`${config.tooltip.label.format(ttl.label, this.tickAttribute, ttl)}`).width,
            );
          }
          if (config.tooltip.value.format) {
            valueWidth = parseInt(
              ctx.measureText(config.tooltip.value.format(ttl.value, this.tickAttribute, ttl)).width,
            );
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
            label: ttl.labelByPlot || ttl.label,
            value: ttl.value,
            colorLabel: ttl.colorByPlot ? drawTooltipCircle(ttl.colorByPlot) : drawTooltipCircle(ttl.color),
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
                            ${config.tooltip.label.format(ttl.label, this.tickAttribute, tooltipList[i])}
                          </div><div style='display: inline-block;'>:</div>`
                          : `<div style='display: inline-block;'></div>`
                      }
                      <div style='display: inline-block; width: ${maxValueWidth}px; text-align: right;'>
                        ${config.tooltip.value.format(ttl.value, this.tickAttribute, tooltipList[i])}  
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

    // let current = new Date().getTime();
    // this.endTime = current - (current % interval);
    this.endTime = dataEnd;
    this.startTime = this.endTime - timeDiff;

    if (this.startTime < dataStart) {
      this.startTime = dataStart;
    }

    const postRender = this.config.common && this.config.common.postRender;

    if (postRender) {
      this.startTime = postRender.startTime;
      this.endTime = postRender.endTime;
    }

    // if (this.endTime > dataEnd) {
    //   this.endTime = dataEnd;
    // }
  };

  // setTimeStandard = (data, idx) => {
  //   let config = this.config;
  //   let { timeDiff } = config.xAxis

  //   if (idx === 0) {
  //     let current = parseInt(new Date().getTime() / 1000) * 1000;
  //     this.endTime = current;
  //     this.startTime = current - timeDiff;
  //     this.dataStartTime = data[0][0];
  //     this.dataEndTime = data[0][0];
  //   }

  //   let length = data.length;

  //   for (let i = 0; i < length; i++) {
  //     if (this.dataStartTime > data[i][0]) {
  //       this.dataStartTime = data[i][0];
  //     }
  //     if (this.dataEndTime < data[i][0]) {
  //       this.dataEndTime = data[i][0];
  //     }
  //   }

  //   if (this.startTime < this.dataStartTime) {
  //     this.startTime = this.dataStartTime;
  //   }
  //   if (this.endTime > this.dataEndTime) {
  //     this.endTime = this.dataEndTime;
  //   }

  // }

  updateData = (dataset) => {
    if (!dataset || !Array.isArray(dataset)) {
      return;
    }
    let that = this;
    let config = this.config;
    this.chartAttr = getChartAttr(this);
    let plots = definePlotCount(config, this.chartAttr.h);
    let themeId = this.themeId;
    const { fixedMin, fixedMax, unitDivider, integerOnly } = config.yAxis;

    let currentMax = 0;
    let currentMin = 0;

    dataset.map((ds, idx) => {
      if (that.data.containsKey(ds.key) && that.data.get(ds.key).data) {
        let cData = that.data.get(ds.key);
        ds.data.map((datum) => {
          /**
           * `config.common.identicalDataBehavior`
           * 실시간 데이터의 경우, 데이터 생성이 완료되기 전에 API Call로 인해서 data가 수신되었을 수 있다.
           * 이 경우, 이 후에 나머지 데이터가 전송되는 경우, 보간할 것인지 (sum / avg) 혹은 대체할 것인지 (replace)
           * 아니면 중복시킬 것인지(권장되지 않음)를 결정한다.
           */
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
          /**
           * V0.8.6
           * (Bug fix) value가 한 번 올라간 다음에 다시 내려가지 않는 문제에 대한 fix
           */
          // if (!fixedMax && datum[1] > that.maxValue ) {
          //   that.maxValue = getMaxValue(datum[1], plots);
          // }
          // if (!fixedMin && datum[1] < that.minValue) {
          //   that.minValue = datum[1];
          // }
        });

        if (cData.data) {
          that.heapSort.sort(cData.data, false, 0);
        }
      } else {
        let colorValue = that.palette.getColorFromId(ds.id, themeId);
        let strokeValue = CoreFunc.formatRgb(colorValue.rgb, colorValue.alpha);
        let fillValue = CoreFunc.formatRgb(colorValue, 0.2);
        that.data.put(ds.key, { id: ds.id, label: ds.label, data: ds.data, color: strokeValue, fill: fillValue });
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
    if (!fixedMax && currentMax !== 0 && !config.yAxis.tickFocusValue) {
      this.tickAttribute = getMaxValue(currentMax, plots, unitDivider, integerOnly);
      this.maxValue = this.tickAttribute.maxValue;
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
    let selectRedLine = this.selectRedLine;
    // const { timeDiff }            = config.xAxis;
    const { disconnectThreshold, area, plotMaxValue, lineOptions, focus } = config.common;
    const { x, y, w, h } = this.chartAttr;
    ctx.save();

    let _dots = [];
    let en = this.data.keys();
    let maxValueDot = false;

    let seriesCount = 0;
    while (en.hasMoreElements()) {
      seriesCount++;
      let key = en.nextElement();
      let value = this.data.get(key);
      let prevTimestamp = 0;
      let prevXCoord = 0;
      let prevYCoord = 0;

      let lineOption = lineOptions[key];

      if (lineOption && lineOption.hidden) {
        continue;
      }

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

        let yPos = 1;
        if (datum[1] > this.minValue) {
          if (datum[1] > this.maxValue) {
            yPos = 0;
          } else {
            yPos = 1 - (datum[1] - this.minValue) / (this.maxValue - this.minValue);
          }
        } else {
          yPos = 0.999;
        }
        let yCoord = y + h * yPos;

        /**
         * plot과 plot을 이어주는 line
         */
        ctx.lineWidth = 1.5;
        if (lineOption) {
          if (lineOption.color) {
            value.color = lineOption.color;
          }
          if (lineOption.width) {
            ctx.lineWidth = lineOption.width;
          }
        }
        let labelByPlot = undefined;
        let colorByPlot = undefined;
        if (config.tooltip && config.tooltip.labelByPlot) {
          let findLabel = config.tooltip.labelByPlot;
          let findColor = config.tooltip.colorByPlot;
          labelByPlot = datum[findLabel];
          colorByPlot = datum[findColor];
        }

        const thisDot = {
          rowData: value.rowData,
          key: key,
          id: value.id,
          label: value.label,
          labelByPlot: labelByPlot,
          colorByPlot: colorByPlot,
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

        if (!lineInit) {
          ctx.beginPath();

          ctx.strokeStyle = value.color;
          if (this.focused && this.focused.length > 0 && this.focused.find((fc) => fc.id !== value.id)) {
            ctx.strokeStyle = theme.unselected;
          }
          ctx.moveTo(xCoord, yCoord);
          lineInit = true;
        } else {
          if (datum[0] - prevTimestamp < disconnectThreshold) {
            ctx.lineTo(xCoord, yCoord);
            ctx.stroke();

            if (area === true) {
              drawArea(ctx, {
                datum,
                prevXCoord,
                prevYCoord,
                xCoord,
                yCoord,
                chartAttr: this.chartAttr,
                fillStyle: value.fill,
                areaByData: config.common.areaByData,
              });
            }
          } else {
            ctx.closePath();
          }

          ctx.beginPath();
          ctx.moveTo(xCoord, yCoord);
        }

        if (
          plotMaxValue &&
          this.maxValueData[0] &&
          !maxValueDot &&
          this.maxValueData[0] === datum[0] &&
          this.maxValueData[1] === datum[1]
        ) {
          maxValueDot = thisDot;
        }

        _dots.push(thisDot);

        prevTimestamp = datum[0];
        prevXCoord = xCoord;
        prevYCoord = yCoord;
      }
    } // end of drawData

    if (focus !== false) {
      drawFocus(ctx, {
        chartAttr: this.chartAttr,
        startTime: this.startTime,
        endTime: this.endTime,
        focus,
      });
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

    if (selectRedLine) {
      let xPos = x + w * ((selectRedLine - startTime) / (endTime - startTime));
      ctx.strokeStyle = '#FF0000';
      ctx.beginPath();
      ctx.moveTo(xPos, y);
      ctx.lineTo(xPos, y + h);
      ctx.stroke();
    }

    const drawDot = (dot) => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
      ctx.fillStyle = dot.color;
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
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

    if (plotMaxValue && (!this.focused || this.focused.length === 0) && maxValueDot) {
      ctx.beginPath();
      ctx.arc(maxValueDot.x, maxValueDot.y, maxValueDot.r + 1, 0, 2 * Math.PI);
      ctx.fillStyle = maxValueDot.color;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(maxValueDot.x, maxValueDot.y, maxValueDot.r - 1, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    this.dots = _dots;
    ctx.restore();
  };
}

export default LineChart;
