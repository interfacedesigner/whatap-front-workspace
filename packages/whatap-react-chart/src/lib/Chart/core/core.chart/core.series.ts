import LineChartHelper, { roundRect, tagShape } from '../../helper/helper.lineChart';
import { getSeriesTooltipText } from '../../helper/helper.seriesChart';
import { checkNumber, fittingString, getDrawAreaX } from '../../helper/helper.value';
import { getMousePos } from '../../helper/mouseEvt';
import { ConfigAttribute, DrawTopnAttribute } from '../../interfaces/ConfigInterface';
import mixin from '../../util/mixinBuilder';

export const SeriesCore = (Base: any) =>
  class extends mixin(Base).extend(LineChartHelper) {
    private intervalKey: any;
    public chartSub: any;
    public config: ConfigAttribute;
    public ctx: CanvasRenderingContext2D;
    public setBarSizeAttr = () => {
      this.setHorizontalBarAreaCount();
    };

    private makeDataObj = (ds: any) => {
      const data: Array<any> = ds.data.filter((d) => {
        return Array.isArray(d) && d.length >= 2 && d[0];
      });
      this.heapSort.sort(data);
      const dataLength = data.length;
      const dataStartTime = data[0][0];
      const dataEndTime = data[dataLength - 1][0];
      let maxValue = 0;
      let maxValueData: undefined | [number, number];
      data.map((d) => {
        if (!checkNumber(d[1])) {
          return;
        }

        if (d[1] >= maxValue) {
          maxValue = d[1];
          maxValueData = d;
        }
      });

      const id = typeof ds.id === 'string' || checkNumber(ds.id) ? ds.id : 0;

      return {
        rowData: ds,
        key: ds.key,
        id: id,
        data: data,
        label: ds.label || ds.id,
        dataStartTime,
        dataEndTime,
        maxValue,
        maxValueData,
        dayStime: new Date(dataEndTime).setHours(0, 0, 0, 0),
      };
    };

    // 현재 가지고 있는 데이터의 배열들 중에 단 하나의 maxValue를 선별 (기준 - 1순위: 가장 높은 값, 2순위: 가장 최근 시간, 3순위: 가장 뒷 배열 (차트의 가장 앞에 그려짐))
    // 데이터 추가, 삭제의 경우에 이용
    public updateMaxValue = () => {
      const dataLength = this.data.length;
      if (this.data.length) {
        for (let i = 0; i < dataLength; i++) {
          const obj = this.data[i];

          if (obj.maxValueData) {
            //maxValueData는 undefined일 가능성이 존재하는 값이기에 꼭 확인해줘야함
            if (this.dataMaxValueData) {
              // 동일하게 없을 수 있는 값임
              //값이 더 높거나, 값이 현재의 최대값과 같으며 더 최근 시간인 경우에는 맥스 값을 갱신한다.
              if (
                obj.maxValue > this.dataMaxValue ||
                (this.dataMaxValue === obj.maxValue && obj.maxValueData[0] >= this.dataMaxValueData[0])
              ) {
                this.dataMaxValue = obj.maxValue;
                this.dataMaxValueData = obj.maxValueData;
              }
            } else {
              this.dataMaxValue = obj.maxValue;
              this.dataMaxValueData = obj.maxValueData;
            }
          }

          if (this.config.common.findMaxValueFromXAxisRange && obj.dayStime === this.chartSub.dayStime) {
            this.xAxisRangeMaxValueData = obj.maxValueData;
          }
        }
      } else {
        this.dataMaxValue = 0;
        this.dataMaxValueData = undefined;
      }
    };

    public lineChartDataSetConverter = (dataset: Array<any>) => {
      const { config } = this;
      const datasetLength = dataset.length;

      let startTime = Infinity;
      let endTime = 0;
      this.dataMaxValueData = undefined;
      this.dataMaxValue = 0;
      for (let i = 0; i < datasetLength; i++) {
        const ds = dataset[i];
        if (typeof ds !== 'object' || !Array.isArray(ds.data) || !ds.data[0]) {
          continue;
        }
        const obj = this.makeDataObj(ds);
        if (startTime > obj.dataStartTime) {
          startTime = obj.dataStartTime;
        }
        if (obj.dataEndTime > endTime) {
          endTime = obj.dataEndTime;
        }
        this.dataIndex[ds.key] = this.data.push(obj) - 1;
      }

      // 날짜 비교 차트의 경우 기준이 되는 날짜 값을 지정
      if (typeof config.xAxis.dayDiffMulti === 'number') {
        const date = new Date(config.xAxis.dayDiffMulti);
        this.chartSub.dayStime = startTime = date.setHours(0, 0, 0, 0);
        endTime = date.setHours(24, 0, 0, 0);
      } else if (config.xAxis.dayDiff || config.xAxis.dayDiffMulti) {
        this.chartSub.dayStime = new Date(endTime || Date.now()).setHours(0, 0, 0, 0);
      }

      if (config.xAxis.dayDiff) {
        this.lineChartDayDiffConverter();
      }

      if (config.common.stack) {
        this.chartSub.dataStartTime = startTime;
        this.chartSub.dataEndTime = endTime;
      }
      this.updateMaxValue();

      return [startTime, endTime];
    };

    // updateData 의 경우
    public lineChartDataUpdateConverter = (dataset: Array<any>) => {
      const { config } = this;
      const datasetLength = dataset.length;

      let startTime = this.startTime;
      let endTime = this.endTime;
      for (let i = 0; i < datasetLength; i++) {
        const ds = dataset[i];
        if (typeof ds !== 'object' || !Array.isArray(ds.data) || !ds.data[0]) {
          continue;
        }
        const key = ds.key;
        let dataEndTime = 0;
        if (typeof this.dataIndex[key] !== 'undefined') {
          const thisData = this.data[this.dataIndex[ds.key]] as any;
          const thisDataLength = thisData.data.length;

          const seriesData = [].concat(ds.data);
          // 시리즈 데이터를 시간 순서로 정렬
          this.heapSort.sort(seriesData);
          const dataLength = seriesData.length;

          for (let j = 0; j < dataLength; j++) {
            const d = seriesData[j];
            if (!Array.isArray(d) || !checkNumber(d[0])) {
              continue;
            }
            // 최근 데이터의 경우 푸시
            if (d[0] > thisData.dataEndTime) {
              // 맥스값 이상인 경우 갱신
              if (checkNumber(d[1]) && d[1] >= thisData.maxValue) {
                thisData.maxValue = d[1];
                thisData.maxValueData = d;
              }
              thisData.data.push(d);
            } else {
              for (let k = thisDataLength - 1; k >= 0; k--) {
                const thisD = thisData.data[k];
                const time = thisD[0];
                let update = false;
                if (time > d[0]) {
                  continue;
                }

                if (time === d[0]) {
                  // 동일 시간 데이터 들어오면 변경
                  thisData.data[k] = d;
                  update = true;
                  k = -1;
                } else if (time < d[0]) {
                  thisData.data.splice(k + 1, 0, d);
                  update = true;
                  k = -1;
                }

                // 데이터 업데이트를 한 경우, 현재의 최댓값보다 높으면 갱신을 한다.
                if (update && checkNumber(d[1])) {
                  if (d[1] > thisData.maxValue || (d[1] === thisData.maxValue && time === d[0])) {
                    thisData.maxValue = d[1];
                    thisData.maxValueData = d;
                  }
                  break;
                }
              }
            }
          }

          dataEndTime = seriesData[dataLength - 1][0];
          if (dataEndTime > thisData.dataEndTime) {
            thisData.dataEndTime = dataEndTime;
          }
          if (dataEndTime > endTime) {
            endTime = dataEndTime;
          }
        } else {
          const obj = this.makeDataObj(ds);
          dataEndTime = obj.dataEndTime;

          if (startTime > obj.dataStartTime) {
            startTime = obj.dataStartTime;
          }
          if (obj.dataEndTime > endTime) {
            endTime = obj.dataEndTime;
          }
          this.dataIndex[ds.key] = this.data.push(obj) - 1;

          if (config.xAxis.dayDiff && obj.dayStime > this.chartSub.dayStime) {
            this.chartSub.dayStime = obj.dayStime;
          }
        }

        if (config.common.stack && this.chartSub['dataEndTime'] < dataEndTime) {
          this.chartSub['dataEndTime'] = dataEndTime;
        }
      }

      if (config.xAxis.dayDiff) {
        this.lineChaftDayDiffUpdateConverter();
      }
      this.updateMaxValue();

      return [startTime, endTime];
    };

    private lineChartDayDiffConverter = () => {
      const { data, dataIndex } = this;
      if (data.length >= 2 && data[0].dayStime === this.chartSub.dayStime) {
        // 최근 시간 데이터가 저장된 시리즈가 배열의 뒤로 가도록 (차트의 앞에 보임)
        dataIndex[this.data[0].key] = 1;
        dataIndex[this.data[1].key] = 0;
        this.data = [this.data[1], this.data[0]];
      }
    };

    private lineChaftDayDiffUpdateConverter = () => {
      const { data } = this;

      const dataLength = data.length;
      if (dataLength < 2) {
        return;
      }

      const standardData = data[1];
      const diffData = data[0];
      const dayStime = new Date(standardData.dataEndTime).setHours(0, 0, 0);
      if (standardData.dayStime !== dayStime) {
        const diff = dayStime - standardData.dayStime;
        if (diff) {
          if (diff === standardData.dayStime - diffData.dayStime) {
            const moveData = [];
            let moveDataMaxValue = 0;
            let moveDataMaxData;
            standardData.data.forEach((d) => {
              if (standardData.dayStime < d[0] && d[0] < dayStime) {
                if (d[1] >= moveDataMaxValue) {
                  moveDataMaxValue = d[1];
                  moveDataMaxData = d;
                }
                moveData.push(d);
              }
            });

            const moveDataLength = moveData.length;
            if (moveDataLength) {
              diffData.data = moveData;
              diffData.dayStime = standardData.dayStime;
              diffData.dataStartTime = moveData[0][0];
              diffData.dataEndTime = moveData[moveDataLength - 1][0];
              diffData.maxValue = moveDataMaxValue;
              diffData.maxValueData = moveDataMaxData;
            }
          }
          this.chartSub.dayStime = dayStime;
          standardData.dayStime = dayStime;
        }
      }

      if (data[0].dayStime === data[1].dayStime) {
        // 새로 들어온 데이터의 시간이 비교해야하는 차트와 같은 경우 비교해야 하는 차트에 추가
        const diffData = data[0];
        data[1].data.forEach((d, i) => {
          const diffDataLength = diffData.data.length;
          if (d[0] > diffData.data[diffDataLength - 1][0]) {
            diffData.data.push(d);
            if (d[1] >= diffData.maxValue) {
              diffData.maxValue = d[1];
              diffData.maxValueData = d;
            }
            diffData.dataEndTime = d[0];
          }
        });

        delete this.dataIndex[data[1].key];
        this.data = [this.data[0]];
      }
    };

    public setStackValue = () => {
      const { data, chartSub } = this;
      const dataLength = data.length;
      chartSub.stackMaxValue = 0;
      const stackTotalMatch = (chartSub.stackValueMatch = {} as any);
      const stackValueMatch = (chartSub.stackValueMatch = {} as any);
      const timeArray = (chartSub.stackTimeArray = []);

      if (!dataLength) {
        return;
      }

      for (let i = 0; i < dataLength; i++) {
        const ds = data[i];
        const dataLength = ds.data.length;
        for (let j = 0; j < dataLength; j++) {
          const dat = ds.data[j];
          const time = dat[0];
          const value = dat[1];
          if (!stackValueMatch[time]) {
            timeArray.push(time);
            stackValueMatch[time] = {};
            stackTotalMatch[time] = 0;
          }
          stackTotalMatch[time] += value;
          stackValueMatch[time][ds.key] = { value, oriValue: value };
        }
      }

      timeArray.sort((a, b) => a - b);
      const timeLength = timeArray.length;
      let prevKey;
      for (let i = dataLength - 1; i >= 0; i--) {
        const ds = data[i];
        const dataLength = ds.data.length;
        const key = ds.key;
        if (!dataLength) {
          continue;
        }
        const etime = ds.data[dataLength - 1][0];
        let j = timeArray.indexOf(ds.data[0][0]);
        // if(j > 0){
        //   stackValueMatch[timeArray[j - 1]][key] = { value: 0 };
        // }
        let prevTime = timeArray[j];
        let nextTime = 0;
        while (j < timeLength) {
          const time = timeArray[j];
          const timeMatch = stackValueMatch[time];
          const stackValue = (timeMatch[prevKey] && timeMatch[prevKey].value) || 0;
          if (typeof timeMatch[key] !== 'undefined') {
            timeMatch[key].value += stackValue;
            if (chartSub.stackMaxValue < timeMatch[key].value) {
              chartSub.stackMaxValue = timeMatch[key].value;
            }
            nextTime = 0;
            prevTime = timeArray[j];
          } else {
            if (!nextTime) {
              let k = j;
              while (k < timeLength) {
                if (stackValueMatch[timeArray[k]][key]) {
                  nextTime = timeArray[k];
                  break;
                }
                k++;
              }

              if (!nextTime) {
                break;
              }
            }

            const prevValue = stackValueMatch[prevTime][key].oriValue;
            const nextValue = stackValueMatch[nextTime][key].oriValue;
            const timeDiff = nextTime - prevTime;
            const percent = (time - prevTime) / timeDiff;
            const percentValue = prevValue + (nextValue - prevValue) * percent;

            stackValueMatch[time][key] = { value: percentValue + stackValue };
          }
          ++j;
        }

        prevKey = key;
      }

      this.chartSub.stackValueMatch = stackValueMatch;
      this.chartSub.stackTimeArray = timeArray;
      this.chartSub.stackTotalMatch = stackTotalMatch;
    };

    private getLastDots = () => {
      const { ctx, dots, config } = this;
      const yAxis = config.yAxis;
      const format = yAxis.tick.format;
      const dotsLength = dots.length;

      let lastDots = [];
      let yTickValueWidthMax = 0;
      for (let i = 0; i < dotsLength; i++) {
        const dot = dots[i];
        const dotLength = dot.length;
        if (!dotLength) {
          continue;
        }
        const lastDot = dot[dotLength - 1];
        const yTickValue = format ? format(lastDot.value, this.yTickAttr) : lastDot.value.toString();
        const yTickValueWidth = ctx.measureText(yTickValue).width;
        if (yTickValueWidthMax < yTickValueWidth) {
          yTickValueWidthMax = yTickValueWidth;
        }
        lastDot.yTickValue = yTickValue;
        lastDot.yTickValueWidth = yTickValueWidth;
        lastDots.push(lastDot);
      }
      // 내림차순
      lastDots.sort((a, b) => (b?.value || 0) - (a?.value || 0));
      return lastDots;
    };

    public drawTopnTick = ({ dot, yTickWidth = 0, labelHeight = 0 }: DrawTopnAttribute) => {
      const { ctx, chartAttr, palette } = this;
      const { x, widthX } = chartAttr;
      const getColor = palette.getThemeData;
      const dataset: any = dot.data;
      const dotCircleRadius = 5;
      const PAD = 4;

      // dot circle
      ctx.beginPath();
      ctx.fillStyle = getColor('bg_color_component');
      ctx.arc(dot.x, dot.y, dotCircleRadius + 1, 0, 2 * Math.PI, false);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = dataset.theme.color;
      ctx.arc(dot.x, dot.y, dotCircleRadius, 0, 2 * Math.PI, false);
      ctx.fill();

      // tagShape
      ctx.fillStyle = dataset.theme.color;
      tagShape(ctx, x + widthX, dot.y - labelHeight / 2, yTickWidth, labelHeight, 2, 4).fill();

      // tick
      ctx.beginPath();
      ctx.textBaseline = 'middle';
      ctx.fillStyle = getColor('bg_color_component');
      ctx.fillText(dot.yTickValue, widthX + PAD, dot.y);
    };

    public drawTopnLabel = ({ dot, labelHeight = 0, rank = 0, invert }: DrawTopnAttribute) => {
      const { ctx, chartAttr, palette } = this;
      const { x, w, heightY } = chartAttr;
      const PAD = 4;
      const rankY = labelHeight * (rank - 1) + PAD;
      if (rankY > heightY - labelHeight) {
        // 축을 초과할 경우 그리지 않음
        return;
      }

      const dataset: any = dot.data;
      const getColor = palette.getThemeData;

      const rankWidth = ctx.measureText(rank.toString()).width;
      const rankX = x + PAD;
      const labelStartX = rankX + rankWidth + PAD * 2;
      const label = fittingString(ctx, dataset.label, w - labelStartX);

      ctx.beginPath();
      ctx.lineWidth = 1;

      roundRect(ctx, rankX, rankY, rankWidth + PAD, labelHeight - 2, 2);

      if (invert) {
        ctx.fillStyle = dataset.theme.color;
        ctx.fill();
        ctx.fillStyle = getColor('bg_color_component');
        ctx.fillText(rank.toString(), rankX + PAD / 2, rankY + labelHeight / 2);
      } else {
        ctx.strokeStyle = dataset.theme.color;
        ctx.stroke();
        ctx.fillStyle = dataset.theme.color;
        ctx.fillText(rank.toString(), rankX + PAD / 2, rankY + labelHeight / 2);
      }

      ctx.beginPath();
      ctx.fillStyle = getColor('bg_font_color');
      ctx.fillText(label, labelStartX, rankY + labelHeight / 2);
    };

    public drawTopn = () => {
      const { ctx, chartAttr, maxValueWidth } = this;
      const lastDots = this.getLastDots();
      const yTickValueWidthMax = Math.max(...lastDots.map((dot) => dot.yTickValueWidth), maxValueWidth);
      const labelHeight = 15;
      const labelMaxCount = Math.floor(chartAttr.h / labelHeight) + 1;
      const PAD = 4;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1.5;

      for (let index = lastDots.length - 1; index >= 0; index--) {
        const rank = index + 1;
        const dot = lastDots[index];
        const dataset: any = dot.data;
        const yTickWidth = yTickValueWidthMax + PAD;

        ctx.save();

        if (this.searchId) {
          // 마우스 호버 중
          if (this.searchId.indexOf(dataset.id) !== -1) {
            this.drawTopnTick({ dot, yTickWidth, labelHeight });
            this.drawTopnLabel({ dot, labelHeight, rank, invert: true });
          }
        } else {
          this.drawTopnTick({ dot, yTickWidth, labelHeight });
          // 라벨 그라데이션
          ctx.globalAlpha = 1 / rank - 1 / labelMaxCount;
          this.drawTopnLabel({ dot, labelHeight, rank, invert: false });
        }

        ctx.restore();
      }

      ctx.restore();
    };

    public drawLineChart = () => {
      const { ctx, dots, config, chartAttr } = this;
      const { x, y, w, h, heightY } = chartAttr;
      const { lineOptions, area, cardinality, disconnectThreshold } = config.common;

      if (config.xAxis.dayDiff) {
        this.drawDayDiffLine();
        return;
      }

      if (config.common.stack) {
        this.drawStackChart();
        return;
      }

      ctx.save();

      ctx.beginPath();
      ctx.rect(x + 0.5, y + 0.5, w, h);
      ctx.clip();

      ctx.lineWidth = 1.5;

      const dotsLength = dots.length;

      for (let i = 0; i < dotsLength; i++) {
        const dot = dots[i];
        const dotLength = dot.length;
        if (!dotLength) {
          continue;
        }
        const dataset: any = dot[0].data;
        ctx.save();
        ctx.strokeStyle = dataset.theme.color;
        ctx.fillStyle = dataset.theme.fillColor;

        if (area) {
          ctx.fillStyle = dataset.theme.areaColor;
        }

        const lineOption = lineOptions && lineOptions[dot[0].data.key];
        if (lineOption) {
          const { hidden } = lineOption;
          if (hidden) {
            ctx.restore();
            continue;
          }
        }

        if (this.searchId) {
          if (this.searchId.indexOf(dot[0].data.id) !== -1) {
            ctx.lineWidth = 2;
          } else {
            ctx.globalAlpha = 0.1;
          }
        }

        ctx.beginPath();
        ctx.moveTo(dot[0].x, dot[0].y);
        this.drawLinePath(dot, i, false, { disconnectThreshold });

        if (config.xAxis.dayDiffMulti && dataset.dayStime !== this.chartSub.dayStime) {
          ctx.globalAlpha = 0.5;
          ctx.setLineDash([2, 1]);
          ctx.lineWidth = 1;
        }
        if (!area) {
          ctx.stroke();
        }

        if (area) {
          this.LinePathClose(dot, i);
          ctx.fill();
          ctx.beginPath();
          this.drawLinePath(dot, i);
          ctx.stroke();
        } else if (cardinality && i === 0) {
          this.drawLinePath(dots[dotsLength - 1], i, true);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.restore();
    };

    public drawPlotMaxValue = () => {
      const { config, dataMaxValueDot, ctx, chartAttr } = this;
      if (config.common.plotMaxValue && dataMaxValueDot) {
        const format = config.tooltip.value.format;
        const value = config.common.stack ? dataMaxValueDot.stackTotal : dataMaxValueDot.value;
        const text = format ? format(value, this.yTickAttr) : value;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(dataMaxValueDot.x, dataMaxValueDot.y - 3);
        ctx.lineTo(dataMaxValueDot.x - 4, dataMaxValueDot.y - 9);
        ctx.lineTo(dataMaxValueDot.x + 4, dataMaxValueDot.y - 9);
        ctx.closePath();

        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = dataMaxValueDot.strokeColor;
        ctx.fill();

        ctx.fillStyle = this.palette.getThemeData('bg_font_color');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = `bold 12px Roboto`;

        const semiTextWidth = ctx.measureText(text).width / 2;
        let xPos = dataMaxValueDot.x;
        if (dataMaxValueDot.x + semiTextWidth > chartAttr.widthX) {
          //텍스트가 오른쪽 끝으로 넘어간 경우
          xPos = chartAttr.widthX;
          ctx.textAlign = 'right';
        }

        if (dataMaxValueDot.x - semiTextWidth < chartAttr.x) {
          xPos = chartAttr.x;
          ctx.textAlign = 'left';
        }
        if (config.common.plotMaxText) {
          ctx.fillText(text, xPos, dataMaxValueDot.y - 10);
        }
        ctx.restore();
      }
    };

    private drawDayDiffLine = () => {
      const { ctx, dots, chartAttr } = this;
      const { x, y, w, h, heightY } = chartAttr;
      ctx.save();

      ctx.beginPath();
      ctx.rect(x + 0.5, y + 0.5, w, h);
      ctx.clip();

      const dotsLength = dots.length;
      let restart = true;
      let i = 0;
      while (dotsLength && (i < dotsLength || restart)) {
        const dot = dots[i];
        const dotLength = dot.length;
        if (dotLength) {
          const dataset: any = dot[0].data;
          const today = i;

          if (restart) {
            if (today) {
              ctx.fillStyle = dataset.theme.areaColor;
            } else {
              ctx.fillStyle = dataset.theme.fillColor;
            }
            ctx.beginPath();
            ctx.moveTo(dot[0].x, dot[0].y);
            this.drawLinePath(dot, i);
            this.LinePathClose(dot, i);
            ctx.fill();
          } else {
            ctx.lineWidth = today ? 2 : 1;
            ctx.strokeStyle = dataset.theme.color;
            ctx.beginPath();
            ctx.moveTo(dot[0].x, dot[0].y);
            this.drawLinePath(dot, i);
            ctx.stroke();
          }
        }

        if (i++ === dotsLength - 1 && restart) {
          i = 0;
          restart = false;
        }
      }
      ctx.restore();
    };

    private drawStackChart = () => {
      const { ctx, dots, chartAttr, palette, config } = this;
      const { x, y, w, h } = chartAttr;
      const getColor = palette.getThemeData;
      ctx.save();
      const { disconnectThreshold } = config.common;

      ctx.beginPath();
      ctx.rect(x + 0.5, y + 0.5, w, h);
      ctx.clip();
      ctx.lineWidth = 1.5;

      const dotsLength = dots.length;
      for (let i = 0; i < dotsLength; i++) {
        const dot = dots[i];
        const dotLength = dot.length;
        if (!dotLength) {
          continue;
        }
        const dataset: any = dot[0].data;
        ctx.save();
        ctx.strokeStyle = dataset.theme.color;

        if (this.searchId && this.searchId.indexOf(dot[0].data.id) !== -1) {
          ctx.lineWidth = 2.5;
        }

        ctx.beginPath();
        ctx.moveTo(dot[0].x, dot[0].y);
        this.drawLinePath(dot, i, false, {
          disconnectThreshold,
          closePath: true,
        });
        this.LinePathClose(dot, i);

        ctx.fillStyle = getColor('bg_color_component');
        ctx.fill();
        ctx.fillStyle = dataset.theme.stackColor;
        ctx.fill();

        ctx.beginPath();
        this.drawLinePath(dot, i, false, { disconnectThreshold });
        ctx.stroke();

        ctx.restore();
      }
      ctx.restore();
    };

    public timeToX = (time: number): number | void => {
      if (time === this.startTime) {
        return this.chartAttr.x;
      }
      if (this.startTime < time && time <= this.endTime) {
        const timeDiff = this.endTime - this.startTime;
        const percent = (time - this.startTime) / timeDiff;
        return this.chartAttr.x + percent * this.chartAttr.w;
      }
    };

    public setLiveTimeInterval = () => {
      this.intervalKey = setInterval(() => {
        const { xAxis } = this.config;
        if (xAxis.liveTime) {
          this.updateChartData([]);
        }
      }, 5000);
    };

    public removeLiveTimeInterval = () => {
      clearInterval(this.intervalKey);
    };

    /**
     * ##################### Interactions #####################
     */

    public lineChartEventListner = () => {
      this.searchDot = [];
      const frontCanvas = this.frontCanvas;
      frontCanvas.addEventListener('mouseover', this.seriesMouseOver);
      frontCanvas.addEventListener('mousemove', this.seriesMouseMove);
      frontCanvas.addEventListener('mouseout', this.seriesMouseOut);
      frontCanvas.addEventListener('mousedown', this.seriesDown);
      frontCanvas.addEventListener('mouseup', this.seriesUp);
      this.observer.subscribe('lineChartMouseEvent', this.resSeriesMouseEvent, this);
      this.observer.subscribe('lineChartMouseOut', this.mouseOutEvent, this);
    };

    private seriesMouseOver = (el: MouseEvent) => {
      this.seriesMouseEvent(el);
    };

    private seriesMouseMove = (el: MouseEvent) => {
      this.throttlingMouseMove(() => {
        const mouseAttr = this.mouseAttr;
        if (mouseAttr.down) {
          const mousePos = getMousePos(el, this.overrideClientRect());
          mouseAttr.x2 = getDrawAreaX(mousePos.mx, this.chartAttr);
          mouseAttr.y2 = mousePos.my;
          if (!mouseAttr.drag && Math.abs(this.mouseAttr.x2 - mouseAttr.x1) > 5) {
            mouseAttr.drag = true;
          }
        }
        this.seriesMouseEvent(el);
      });
    };

    private mouseOutEvent = () => {
      this.searchDot = [];
      if (typeof this.searchId !== undefined) {
        this.searchId = undefined;
        this.drawChart();
      }
      this.prevMouseEvent = undefined;
      this.hoverTime = undefined;
      this.hoverTimePos = undefined;
      clearTimeout(this.mouseMoveLastEvent);
      this.tooltip.tooltipOff();

      this.drawFront();
    };

    private seriesMouseOut = (el: MouseEvent) => {
      this.observer.publish('lineChartMouseOut', el, this);
      this.mouseOutEvent();
    };

    private seriesDown = (el: MouseEvent) => {
      const mouseAttr = this.mouseAttr;
      const mousePos = getMousePos(el, this.overrideClientRect());
      mouseAttr.down = true;
      mouseAttr.x1 = mouseAttr.x2 = getDrawAreaX(mousePos.mx, this.chartAttr);
      mouseAttr.y1 = mouseAttr.y2 = mousePos.my;
    };

    private seriesUp = (el: MouseEvent) => {
      const mouseAttr = this.mouseAttr;
      const mousePos = getMousePos(el, this.overrideClientRect());
      mouseAttr.x2 = getDrawAreaX(mousePos.mx, this.chartAttr);
      mouseAttr.y2 = mousePos.my;

      const searchDot = this.searchDot;
      const config = this.config;

      if (mouseAttr.down) {
        if (mouseAttr.drag) {
          //drag event
          mouseAttr.drag = false;
          const dragCallback = config.common.dragCallback;
          if (dragCallback && Math.abs(mouseAttr.x2 - mouseAttr.x1) > 5) {
            // 너무 적게 드래그한 경우 취소
            const x1Per = (mouseAttr.x1 - this.chartAttr.x) / this.chartAttr.w;
            const x2Per = (mouseAttr.x2 - this.chartAttr.x) / this.chartAttr.w;
            const timeDiff = this.endTime - this.startTime;
            const x1Time = this.startTime + Math.round(timeDiff * x1Per);
            const x2Time = this.startTime + Math.round(timeDiff * x2Per);

            if (x1Time > x2Time) {
              dragCallback(x2Time, x1Time);
            } else {
              dragCallback(x1Time, x2Time);
            }
          }

          this.drawFront();
        } else {
          //click event
          if (config.common.onTimeSelect && searchDot[0]) {
            if (config.common.onTimeSelect(searchDot[0].time, searchDot)) {
              this.selectRedLine = searchDot[0].time;
              this.drawChart();
            }
          }
        }

        mouseAttr.down = false;
      }
    };

    private resSeriesMouseEvent = (data: any, context: any) => {
      if (Array.isArray(data) && data.length) {
        const time = data[0].time;
        const searchDot = [] as any;

        data.map((d: any) => {
          const { id } = d.data;
          if (Array.isArray(this.dots)) {
            this.dots.map((dotList: any) => {
              const length = dotList.length;
              if (length && dotList[0].data.id === id) {
                for (let i = 0; i < length; i++) {
                  const dot = dotList[i];
                  if (dot.time === time) {
                    searchDot.push(dot);
                    break;
                  }
                }
              }
            });
          }
        });

        if (searchDot.length) {
          this.hoverTime = searchDot[0].time;
          this.hoverTimePos = searchDot[0].x;
        } else {
          if (this.startTime < time && time <= this.endTime) {
            this.hoverTime = time;
            const xPos = this.timeToX(time);
            if (typeof xPos === 'number') {
              this.hoverTimePos = Math.round(xPos) + 0.5;
            }
          } else {
            this.hoverTime = undefined;
            this.hoverTimePos = undefined;
          }
        }
        this.drawFront();
      } else {
        if (context.hoverTime) {
          this.hoverTime = context.hoverTime;
          const xPos = this.timeToX(this.hoverTime);
          if (typeof xPos === 'number') {
            this.hoverTimePos = Math.round(xPos) + 0.5;
          }

          this.drawFront();
        }
      }
    };

    private seriesMouseEvent = (el: MouseEvent) => {
      const config = this.config;
      const { mx, my } = getMousePos(el, this.overrideClientRect());
      const searchDot = this.seriesSearchDot(mx, my);
      const prevSid = this.searchId;

      this.prevMouseEvent = el;
      const tooltip = this.tooltip;
      if (searchDot.length) {
        this.tooltip.changeText(getSeriesTooltipText(searchDot, this.config, this));
        this.hoverTime = searchDot[0].time;
        this.hoverTimePos = searchDot[0].x;
        if (!this.tooltip.tooltipStat) {
          this.tooltip.tooltipOn();
        }
      } else {
        this.tooltip.tooltipOff();
        if (mx >= this.chartAttr.x && mx <= this.chartAttr.widthX) {
          const xPos = mx - this.chartAttr.x;
          if (xPos === 0) {
            this.hoverTime = this.startTime;
            this.hoverTimePos = this.chartAttr.x;
          } else {
            const timeDiff = this.endTime - this.startTime;
            this.hoverTimePos = Math.round(mx) + 0.5;
            const percent = xPos / this.chartAttr.w;
            this.hoverTime = this.startTime + Math.round(percent * timeDiff);
          }
        }
      }

      if (tooltip.tooltipStat) {
        tooltip.follow(el);
      }

      if (!config.tooltip.selectAll) {
        if (searchDot[0]) {
          const idList: any = [];
          searchDot.forEach((dot: any) => {
            const id = dot.data.id;
            if (idList.indexOf(id) === -1) {
              idList.push(id);
            }
          });

          this.searchId = idList;
        } else {
          this.searchId = undefined;
        }

        if (this.searchId !== prevSid) {
          this.drawChart();
        }
      }

      this.observer.publish('lineChartMouseEvent', searchDot, this);
      this.searchDot = searchDot;
      this.drawFront();
    };

    private seriesSearchDot = (mx: number, my: number) => {
      const dots: any = this.dots;
      const config = this.config;
      const selectAll = config.tooltip.selectAll;
      const xRange = 16;
      const x1 = mx - xRange;
      const x2 = mx + xRange;

      let searchDot = [] as any;
      let oneDot: any;

      if (mx < this.chartAttr.x) {
        return searchDot;
      }

      dots.map((dot: Array<Array<any>>) => {
        const dotLength = dot.length;
        let sDot;

        for (let i = 0; i < dotLength; i++) {
          const d = dot[i] as any;
          if (config.common.lineOptions) {
            const lineOption = config.common.lineOptions[d.data.key];
            if (lineOption && lineOption.hidden) {
              continue;
            }
          }

          if (d.oriX > x2) {
            break;
          }
          if (x1 <= d.oriX) {
            if (sDot) {
              if (Math.abs(mx - sDot.oriX) >= Math.abs(mx - d.oriX)) {
                sDot = d;
              }
            } else {
              sDot = d;
            }
          }
        }

        if (sDot) {
          searchDot.push(sDot);

          if (!selectAll) {
            if (!oneDot) {
              oneDot = sDot;
            } else {
              if (Math.abs(my - oneDot.oriY) >= Math.abs(my - sDot.oriY)) {
                oneDot = sDot;
              }
            }
          }
        }
      });

      if (selectAll) {
        return searchDot;
      } else {
        const returnSameIds = [] as any;
        let sameIdLength = 0;
        if (oneDot) {
          const id = oneDot.data.id;
          searchDot.map((dot: any) => {
            if (dot.data.id === id && oneDot.time === dot.time) {
              sameIdLength = returnSameIds.push(dot);
            }
          });

          if (sameIdLength > 1) {
            return returnSameIds;
          } else {
            return [oneDot];
          }
        }

        return [];
      }
    };
    public updateCustomChartOptions = () => {
      const { customChartOptions, prevCustomChartOptions } = this;

      const maxY = customChartOptions.maxY && customChartOptions.maxY.use && customChartOptions.maxY.value;
      const prevMaxY =
        prevCustomChartOptions.maxY && prevCustomChartOptions.maxY.use && prevCustomChartOptions.maxY.value;

      if (maxY !== prevMaxY) {
        this.setupChart();
        this.makeDots();
        this.drawChart();
      }
      this.drawFront();
    };
  };
