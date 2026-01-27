import { CoreFunc } from '../../core';
import { rectangleElement } from '../elements/element.rectangle';
import { drawTextBox, fillCuttingText } from '../elements/element.text';
import { HitmapHelper } from '../helper/helper.hitmap';
import LineChartHelper, { getLegendId } from '../helper/helper.lineChart';
import { defaultYAxisFormat } from '../helper/helper.value';
import { BarChartDots } from '../interfaces/BarChartInterface';
import { ChartAttribute, ChartType, TickAttribute } from '../interfaces/BaseInterface';
import {
  ConfigAttribute,
  DotConfig,
  EqualizerChartConfigAttribute,
  HitmapConfigAttribute,
} from '../interfaces/ConfigInterface';
import { HitmapSelectedArea, HitmapStr } from '../interfaces/HitmapInterface';
import { CHART_TICK_SPACE, FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import { defineBlockColor, defineErrorExists, getCurrentXPosition, getCurrentYPosition } from '../util/hitmapUtils';
import mixin from '../util/mixinBuilder';

export const ComponentCore = (Base: any) =>
  class extends mixin(Base).extend(HitmapHelper, LineChartHelper, rectangleElement) {
    public ctx: CanvasRenderingContext2D;
    public chartType: ChartType;
    public chartSubtype?: ChartType;
    public config: HitmapConfigAttribute | EqualizerChartConfigAttribute;
    public endTime: number;
    public startTime: number;
    public timeRange: number;
    public chartAttr: ChartAttribute;
    public selectedArea: HitmapSelectedArea;
    public searchId?: any;
    public yTickAttr: TickAttribute;

    public drawData = () => {
      const chartType = this.chartType;

      switch (chartType) {
        case 'HitmapChart':
          // this.setHitmapComponentAttributes();
          this.drawHitmapChartData();
          this.drawHitmapSelectedRect();
          break;
        case 'HorizontalBarChart':
          this.drawHorizontalBarData();
          break;
        case 'EqualizerChart':
          this.drawEqaulizerChart();
          break;
        case 'LineChart':
        default:
          if (this.chartSubtype === 'TopnLineChart') {
            this.drawTopn();
          }
          this.drawLineChart();
          this.drawPlotMaxValue();
          this.drawLegend();
          break;
      }
    };

    private drawHitmapChartData = () => {
      const config = this.config;
      const endTime = this.endTime;
      const startTime = this.startTime;
      const duration = this.duration;
      const interval = this.interval;
      const data = this.data;
      const errorOnly = config.hitmap.errorOnly;
      const level = config.hitmap.level;
      const levelColor = {
        [HitmapStr.HIT]: [
          this.store?.theme?.color?.semantic?.chart_hitmap_normal_1 ?? this.palette.getThemeData('normal_1'),
          this.store?.theme?.color?.semantic?.chart_hitmap_normal_2 ?? this.palette.getThemeData('normal_2'),
          this.store?.theme?.color?.semantic?.chart_hitmap_normal_3 ?? this.palette.getThemeData('normal_3'),
        ],
        [HitmapStr.ERR]: [
          this.store?.theme?.color?.semantic?.chart_hitmap_warning_1 ?? this.palette.getThemeData('bg_warning_1'),
          this.store?.theme?.color?.semantic?.chart_hitmap_warning_2 ?? this.palette.getThemeData('bg_warning_color'),
          this.store?.theme?.color?.semantic?.chart_hitmap_warning_3 ?? this.palette.getThemeData('bg_critical_color'),
        ],
      };
      const yValueMax = config.yAxis.maxValue;
      const columnBlockCount = config.hitmap.columnBlockCount;
      const { x, y, w, h } = this.chartAttr;

      /**
       * Set `blockWidth` & `blockHeight` values
       */
      this.setHitmapBlockSize();

      this.ctx.strokeStyle = CoreFunc.formatRgb(CoreFunc.parseHexToRgb(this.theme.background), 0.75);
      this.ctx.lineWidth = Math.min(this.blockWidth, this.blockHeight) * 0.25;

      let rmCount = 0;
      data.map((datum) => {
        const timeKey = datum[0];

        if (timeKey < startTime) {
          rmCount++;
          return;
        }

        if (timeKey <= endTime) {
          const xPos = getCurrentXPosition(x, w, timeKey, startTime, duration);
          const hit = this.convertDataToBlocks(datum[1], yValueMax);
          const err = this.convertDataToBlocks(datum[2], yValueMax);

          for (let i = 0; i < columnBlockCount; i++) {
            /**
             * when there is no data present
             */
            const hitum = errorOnly ? 0 : hit[i];
            const errum = err[i];
            if (hitum === 0 && errum === 0) {
              continue;
            }

            let blockColor;
            if (defineErrorExists(errum)) {
              blockColor = defineBlockColor(HitmapStr.ERR, errum, level, levelColor);
            } else {
              blockColor = defineBlockColor(HitmapStr.HIT, hitum, level, levelColor);
            }
            const yPos = getCurrentYPosition(y, h, columnBlockCount, i);
            this.drawBlock(blockColor, xPos, yPos, this.blockWidth, this.blockHeight);
          }
        }
      });

      if (rmCount) {
        data.splice(0, rmCount);
      }
    };

    private drawHitmapSelectedRect = () => {
      const selectedArea = this.selectedArea;
      const config = this.config;
      const ctx = this.ctx;
      const { x, y, w, h } = this.chartAttr;
      const startTime = this.startTime;
      const endTime = this.endTime;
      const yValueMax = config.yAxis.maxValue || 10000;

      if (selectedArea) {
        const x1 = x + w * ((selectedArea.startTime - startTime) / (endTime - startTime));
        const x2 = x + w * ((selectedArea.endTime - startTime) / (endTime - startTime));
        let y1 = y + h * ((yValueMax - selectedArea.maxValue) / yValueMax);
        let y2 = y + h * ((yValueMax - selectedArea.minValue) / yValueMax);
        y1 = y1 < y ? y : y1;
        y2 = y2 < y ? y : y2;
        ctx.save();
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 3]);

        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        ctx.restore();
      }
    };

    private drawLineChartData = () => {
      const { ctx, dots, config, chartAttr, dataMaxValue } = this;
      const { area, cardinality, stack } = config.common;
      const dayDiff = config.xAxis.dayDiff;

      const isDot = config.dot.display;

      const lineOptions = config.common.lineOptions;
      const { x, y, w, h } = chartAttr;
      const heightY = chartAttr.heightY + 0.5;
      let maxValueDot: any;
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.rect(x + 0.5, y + 0.5, w, h);
      ctx.clip();

      dots.map((dot: any, idx: number) => {
        if (!Array.isArray(dot) || !dot[0]) {
          return;
        }
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = dot[0].strokeColor;
        ctx.fillStyle = stack ? dot[0].strokeColor : dot[0].fillColor;

        if (dayDiff) {
          if (idx === 1) {
            ctx.lineWidth = 2;
            let graY = y;
            if (this.data[idx] && this.data[idx].maxValueDot) {
              graY = this.data[idx].maxValueDot.y;
            }
            const gra = ctx.createLinearGradient(x, graY, x, heightY);
            gra.addColorStop(0, 'rgba(125,233,255, 0.5)');
            gra.addColorStop(1, 'rgba(55,183,255, 0.5)');
            ctx.fillStyle = gra;
          } else {
            ctx.lineWidth = 1.5;
            ctx.fillStyle = '#E0E0E0';
          }
        }
        if (lineOptions) {
          const lineOption = lineOptions[dot[0].data.key];
          if (lineOption) {
            if (lineOption.hidden) {
              ctx.restore();
              return;
            }
          }
        }

        if (typeof this.searchId !== 'undefined') {
          if (this.searchId.indexOf(dot[0].data.id) !== -1) {
            ctx.lineWidth = 2.5;
          } else {
            ctx.globalAlpha = 0.1;
          }
        }

        dot.map((data: any, i: number) => {
          const { x, y } = data;

          if (dataMaxValue === data.value) {
            maxValueDot = data;
          }
          if (i === 0) {
            ctx.moveTo(x, y);
            return;
          }

          ctx.lineTo(x, y);
        }); // 여기까지 dot roop
        ctx.stroke();
        if (area || config.xAxis.dayDiff) {
          ctx.lineTo(dot[dot.length - 1].x, heightY);
          ctx.lineTo(dot[0].x, heightY);
          ctx.fill();
        } else if (cardinality) {
          if (0 === idx) {
            const minDotsIdx = dots.length - 1;
            const minDots = dots[minDotsIdx];

            minDots.map((minDot: any, i: number) => {
              const rvsIdx = dot.length - 1 - i;
              const rvs = minDots[rvsIdx];
              if (rvs) {
                ctx.lineTo(rvs.x, rvs.y);
              }
            });
            ctx.fill();
          }
        } else if (stack) {
          const dotLength = dot.length - 1;
          dot.map((dotum, dotIdx) => {
            let rvs = dot[dotLength - dotIdx];
            if (rvs) {
              ctx.lineTo(rvs.x, rvs.y2);
            }
          });
          ctx.fill();
        }

        ctx.restore();

        if (isDot) {
          dot.map((data: any, i: number) => {
            this.drawDot(data, config.dot, i);
          });
        }
      }); // 여기까지 dots roop

      this.drawSelectLine();
      ctx.restore(); //여기까지 Draw Line

      if (config.common.plotMaxValue && maxValueDot) {
        const format = config.tooltip.value.format;
        const text = format ? format(maxValueDot.value, this.yTickAttr) : maxValueDot.value;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(maxValueDot.x, maxValueDot.y - 3);
        ctx.lineTo(maxValueDot.x - 4, maxValueDot.y - 9);
        ctx.lineTo(maxValueDot.x + 4, maxValueDot.y - 9);
        ctx.closePath();

        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FFFFFF';
        // ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        // ctx.shadowBlur = 6;
        // ctx.shadowOffsetX = 0;
        // ctx.shadowOffsetY = 2;
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = maxValueDot.strokeColor;
        ctx.fill();

        ctx.fillStyle = this.themeId === 'bk' ? 'white' : '#222222';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = `bold ${FONT_SIZE}px ${FONT_TYPE}`;

        const semiTextWidth = ctx.measureText(text).width / 2;
        let xPos = maxValueDot.x;
        if (maxValueDot.x + semiTextWidth > chartAttr.widthX) {
          //텍스트가 오른쪽 끝으로 넘어간 경우
          xPos = chartAttr.widthX;
          ctx.textAlign = 'right';
        }

        if (maxValueDot.x - semiTextWidth < x) {
          xPos = x;
          ctx.textAlign = 'left';
        }
        if (config.common.plotMaxText) {
          ctx.fillText(text, xPos, maxValueDot.y - 10);
        }
        ctx.restore();
      }
    };

    private drawLegend = () => {
      const { data, config } = this;
      const hasLegend = config.common.legend ? true : false;

      if (hasLegend) {
        const legendId = config.common.legend || '';
        const legendElement = document.getElementById(legendId);
        const prevSid = this.searchId;
        let isUpdate = false;

        if (data && legendElement) {
          if (legendElement.firstChild) {
            isUpdate = true;
          }

          // 레전드 윤곽
          let lgdContainer: any;
          if (isUpdate) {
            lgdContainer = legendElement.firstChild;
          } else {
            lgdContainer = document.createElement('div');
            legendElement.appendChild(lgdContainer);

            // 레전드 윤곽 스타일
            lgdContainer.style.display = 'inline-flex';
            lgdContainer.style.alignItems = 'center';
          }

          // 레전드 아이템
          const sortData = [...data];

          if (!config.common.stack) {
            sortData.sort((a, b) => {
              if (a.label > b.label) {
                return 1;
              }
              if (b.label > a.label) {
                return -1;
              }
              return 0;
            });
          }

          sortData.map((datum: { id: string; label: string; theme: any }) => {
            let { label, theme, id } = datum;
            const color = theme.color;
            let labelId = getLegendId(label, legendId);
            let lgdItem = document.getElementById(labelId);
            let sliced = label.length > 15 ? label.slice(0, 15) + '...' : label;

            if (lgdItem) {
              lgdItem.innerText = sliced;
            } else {
              lgdItem = document.createElement('div');
              lgdContainer.appendChild(lgdItem);
              lgdItem.id = labelId;
              lgdItem.innerText = sliced;

              // 레전드 아이템 스타일
              lgdItem.style.borderLeft = `solid 2.5px ${color}`;
              lgdItem.style.paddingLeft = '4px';
              lgdItem.style.paddingRight = '8px';
              lgdItem.style.fontSize = '11px';
              lgdItem.style.color = '#000000';
              lgdItem.addEventListener('mouseenter', () => {
                this.searchId = [id];
                if ((prevSid && prevSid[0]) !== (this.searchId && this.searchId[0])) {
                  this.drawChart();
                }
              });
              lgdItem.addEventListener('mouseleave', () => {
                this.searchId = undefined;
                this.drawChart();
              });
            }
          });
        }
      }
    };

    // private drawLineChartData = () => {
    //   const { ctx, dots, config, chartAttr, dataMaxValue } = this;
    //   const area = config.common.area;
    //   const { x, y, heightY, widthX, w, h } = chartAttr;
    //   let maxValueDot:any;
    //   ctx.save();
    //   ctx.beginPath();
    //   ctx.lineWidth = 1.5;
    //   ctx.rect(x + 0.5, y + 0.5, w, h);
    //   ctx.clip();

    //   dots.map((dot: any, idx: number) => {
    //     let prevData: any;
    //     dot.map((data: any, i: number) => {
    //       const { x, y, fillColor, strokeColor } = data;
    //       if(dataMaxValue === data.value){
    //         maxValueDot = data;
    //       }
    //       if(!prevData){
    //         prevData = data;
    //         return;
    //       }

    //       ctx.save();
    //       ctx.beginPath();
    //       ctx.strokeStyle = strokeColor;
    //       ctx.fillStyle = fillColor;
    //       if(typeof this.searchId !=="undefined"){
    //         if(data.data.id === this.searchId){
    //           ctx.lineWidth = 2.5;
    //         }else{
    //           ctx.globalAlpha = 0.08;
    //         }
    //       }
    //       ctx.moveTo(prevData.x, prevData.y);
    //       ctx.lineTo(x, y);
    //       ctx.stroke();
    //       if(area){
    //         ctx.lineTo(x, heightY)
    //         ctx.lineTo(prevData.x, heightY);
    //         ctx.fill();
    //       }
    //       ctx.restore();
    //       prevData = data;
    //     })
    //   });

    //   this.drawSelectLine();
    //   ctx.restore(); //여기까지 Draw Line

    //   if(config.common.plotMaxValue && maxValueDot){
    //     const format = config.tooltip.value.format;
    //     const text = format ? format(maxValueDot.value, this.yTickAttr) : maxValueDot.value;
    //     ctx.save();
    //     ctx.beginPath();
    //     ctx.moveTo(maxValueDot.x, maxValueDot.y - 3);
    //     ctx.lineTo(maxValueDot.x - 4, maxValueDot.y - 9);
    //     ctx.lineTo(maxValueDot.x + 4, maxValueDot.y - 9);
    //     ctx.closePath();

    //     ctx.save();
    //     ctx.lineWidth = 1;
    //     ctx.strokeStyle = "#FFFFFF";
    //     ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    //     ctx.shadowBlur = 6;
    //     ctx.shadowOffsetX = 0;
    //     ctx.shadowOffsetY = 2;
    //     ctx.stroke();
    //     ctx.restore();
    //     ctx.fillStyle = maxValueDot.strokeColor;
    //     ctx.fill();

    //     ctx.fillStyle = this.themeId === "bk" ? "white" : "#222222";
    //     ctx.textAlign = "center";
    //     ctx.textBaseline = "bottom";
    //     ctx.font = "11px Roboto";

    //     const semiTextWidth = ctx.measureText(text).width / 2;
    //     let xPos = maxValueDot.x;
    //     if(maxValueDot.x + semiTextWidth > widthX){ //텍스트가 오른쪽 끝으로 넘어간 경우
    //       xPos = widthX;
    //       ctx.textAlign = "right";
    //     }

    //     if(maxValueDot.x - semiTextWidth < x){
    //       xPos = x;
    //       ctx.textAlign = "left";
    //     }

    //     ctx.fillText(text, xPos, maxValueDot.y - 10);
    //     ctx.restore();

    //   }
    // }

    private drawSelectLine = () => {
      const selectRedLine = this.selectRedLine;

      if (selectRedLine) {
        const ctx = this.ctx;
        const x = this.chartAttr.x + 0.5;
        const { w, heightY, y } = this.chartAttr;
        const timeDiff = this.endTime - this.startTime;
        const xPos = Math.round(x + w * ((selectRedLine - this.startTime) / timeDiff)) + 0.5;

        ctx.save();
        ctx.strokeStyle = '#FF0000';
        ctx.beginPath();
        ctx.moveTo(xPos, y);
        ctx.lineTo(xPos, heightY);
        ctx.stroke();
        ctx.restore();
      }
    };

    private drawHorizontalBarData = () => {
      const { dots, ctx, barMargin, barSize, barWidthPad, barDrawHeight, chartAttr, dataMaxValue, labelFont, config } =
        this;
      const { x, rightX, w } = chartAttr;
      ctx.save();

      dots.forEach((dot: any) => {
        if (this.progressDots && this.progressDots[dot.id]) {
          dot = this.progressDots[dot.id];
        }
        const { xStart, xEnd, yStart, datas, label, title, lastIdx, rowData } = dot;
        const xPos = xStart + x;
        const yPos = yStart + barMargin;
        const yMiddle = yPos + barDrawHeight / 2 + 1;

        //Draw Data Bar
        ctx.globalAlpha = 0.3;
        if (dataMaxValue && datas) {
          datas.forEach((dat: any, idx: number) => {
            ctx.save();
            ctx.beginPath();
            const { width, color } = dat;
            ctx.fillStyle = color;
            if (config.yAxis.maxHighlighting) {
              if (rowData.total === dataMaxValue) {
                ctx.fillStyle = this.palette.getThemeData('bg_warning_color');
              }
            }
            const dataX = xPos + dat.x;

            ctx.fillRect(dataX, yPos, width, barDrawHeight);

            //Draw Equalizer 뒤에 애니메이션 동동 떠다니는 거
            if (config.common.animate && idx === lastIdx) {
              ctx.fillRect(dataX + width + this.equalizerPos, yPos, 2, barDrawHeight);
            }
            ctx.restore();
          });
        }
        ctx.globalAlpha = 1;

        let textX = xPos - barMargin - barWidthPad;
        ctx.fillStyle = this.palette.getThemeData('bg_font_color');
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.font = labelFont;
        if (config.yAxis.mode === 2) {
          textX = xEnd - barMargin;
        }
        if (rowData && typeof rowData.active !== 'undefined' && !rowData.active) {
          //Draw Inactive
          ctx.save();
          ctx.strokeStyle = this.palette.getThemeData('bg_disabled_color');
          ctx.setLineDash([4, 2]);
          ctx.beginPath();
          ctx.moveTo(textX, yMiddle);
          ctx.lineTo(textX - 3, yMiddle - 4);
          ctx.lineTo(textX - 12, yMiddle - 4);
          ctx.lineTo(textX - 12, yMiddle + 4);
          ctx.lineTo(textX - 3, yMiddle + 4);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.setLineDash([]);
          ctx.moveTo(textX - 5, yMiddle - 2);
          ctx.lineTo(textX - 9, yMiddle + 2);
          ctx.moveTo(textX - 9, yMiddle - 2);
          ctx.lineTo(textX - 5, yMiddle + 2);
          ctx.stroke();
          ctx.restore();
        } else {
          //Draw Total Value
          ctx.fillText(label, textX, yMiddle);
        }
        ctx.save();
        //Draw Title Text
        ctx.font = '12px Roboto';
        ctx.textAlign = 'left';
        if (config.yAxis.mode === 2) {
          ctx.fillText(title, xStart + barMargin, yMiddle);
        } else {
          fillCuttingText(ctx, title, xPos + barMargin + barWidthPad, yMiddle, w, true);
        }
        ctx.restore();
      });
      ctx.restore();
    };

    private drawEqaulizerChart = () => {
      const ctx = this.ctx;
      let { x, y, w, h, bottomY } = this.chartAttr;
      const theme = this.theme;
      const areaCount = this.areaCount;
      const areaHeight = this.areaHeight;
      const areaDrawHeight = this.areaDrawHeight;
      const dots: BarChartDots = this.dots;
      const BLOCK_AREA = 3;
      const BLOCK_MARGIN = 0.5;
      const BLOCK_SIZE = BLOCK_AREA - BLOCK_MARGIN * 2;
      const maxValue = this.maxValue;
      const plotCount = this.plotCount;
      const plotValue = maxValue / plotCount;
      const config = this.config as EqualizerChartConfigAttribute;
      const xAxisTextMargin = config.xAxis.tick.textMargin ?? 0;
      const maxValueWidth = this.maxValueWidth;
      const palette = this.palette;
      const getThemeData = palette.getThemeData;
      const normalColor = getThemeData('bg_normal_color');
      const fontColor = getThemeData('bg_font_color');

      if (bottomY > areaHeight) {
        bottomY = areaHeight;
      }
      ctx.save();
      if (this.chartSub.scrollY) {
        ctx.translate(0, this.chartSub.scrollY);
      }
      ctx.font = `${11}px ${FONT_TYPE}`;
      ctx.strokeStyle = normalColor;
      ctx.fillStyle = fontColor;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'right';

      if (this.chartSub.scrollY) {
        ctx.translate(0, this.chartSub.scrollY);
      }

      const xStart = Math.floor(x) + 0.5;
      const xEnd = Math.floor(x + w);
      const yTickPos = [0];

      for (let i = 1; plotCount >= i; i++) {
        const perCount = (i * plotValue) / maxValue;
        yTickPos.push(areaDrawHeight * perCount);
      }

      const yTickXStart = xStart - 1;
      for (let i = 1; areaCount >= i; i++) {
        const yStart = i * areaHeight;
        const y2 = yStart - bottomY;
        const y1 = y2 - areaDrawHeight;

        yTickPos.map((h, idx) => {
          ctx.fillText(this.config.format.value(idx * plotValue), yTickXStart, y2 - h);
        });

        ctx.beginPath();
        ctx.moveTo(xStart, y1);
        ctx.lineTo(xStart, y2);
        ctx.lineTo(xStart + w, y2);
        ctx.stroke();
      }

      ctx.textAlign = 'center';
      dots.map((data, idx) => {
        ctx.save();
        let remainderHeight = 0;
        let yStart = data.maxY;
        let textXPos = data.x1 + data.width / 2;

        //Label
        ctx.fillText(data.cuttingLabel, textXPos, data.maxY + 9 + xAxisTextMargin);

        if (this.searchDot && this.searchDot !== data) {
          ctx.globalAlpha = 0.4;
        }

        if (typeof data.active === 'boolean' && !data.active) {
          ctx.strokeStyle = normalColor;
          ctx.lineWidth = 1;
          const width = data.width > 30 ? 24 : data.width - 6;
          const bottomConHeight = width / 3;
          const x1 = textXPos - width / 2;
          const x2 = x1 + width;
          const rectBottom = data.maxY - bottomConHeight;
          const xPadding = 4;
          ctx.beginPath();
          ctx.setLineDash([4, 2]);
          ctx.moveTo(textXPos, data.maxY);
          ctx.lineTo(x2, rectBottom);
          ctx.lineTo(x2, rectBottom - width);
          ctx.lineTo(x1, rectBottom - width);
          ctx.lineTo(x1, rectBottom);
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.setLineDash([]);
          ctx.moveTo(x2 - xPadding, rectBottom - xPadding);
          ctx.lineTo(x1 + xPadding, rectBottom - width + xPadding);
          ctx.moveTo(x1 + xPadding, rectBottom - xPadding);
          ctx.lineTo(x2 - xPadding, rectBottom - width + xPadding);
          ctx.stroke();
        } else {
          data.data.map((value, i) => {
            if (value.data === 0) {
              return;
            }

            //색상 지정
            ctx.fillStyle = value.color || '#90D1FF';
            if (value.gColor) {
              const gra = ctx.createLinearGradient(textXPos, yStart, textXPos, yStart - value.height);
              gra.addColorStop(0, value.gColor[0]);
              gra.addColorStop(1, value.gColor[1]);
              ctx.fillStyle = gra;
            }

            if (value.themeColor) {
              if (Array.isArray(value.themeColor)) {
                const gra = ctx.createLinearGradient(textXPos, yStart, textXPos, yStart - value.height);
                gra.addColorStop(0, getThemeData(value.themeColor[0]));
                gra.addColorStop(1, getThemeData(value.themeColor[1]));
                ctx.fillStyle = gra;
              } else {
                ctx.fillStyle = getThemeData(value.themeColor);
              }
            }

            const dataHeight = value.height + remainderHeight;

            let blockCount = Math.floor(dataHeight / BLOCK_AREA);
            if (value.last) {
              blockCount--;
            }
            if (blockCount < 0) {
              blockCount = 0;
            }

            remainderHeight = dataHeight - BLOCK_AREA * blockCount;
            let yPos = yStart;
            while (blockCount) {
              ctx.fillRect(data.x1, yPos, data.width, -BLOCK_SIZE);
              yPos -= BLOCK_AREA;
              blockCount--;
            }

            if (value.last) {
              const equalizerPos = this.equalizerPos;
              const totalText = config.format.value(data.total);
              ctx.fillRect(data.x1, yPos - equalizerPos, data.width, -BLOCK_SIZE);
              let textYPos = yPos - equalizerPos - 8;
              ctx.font = `400 10px ${FONT_TYPE}`;
              if (data.isMaxValue && config.common.highLightMaxValue) {
                ctx.save();

                textYPos -= 3;
                ctx.font = `700 12px ${FONT_TYPE}`;

                // ctx.strokeStyle = theme.background
                // ctx.lineWidth    = 3;
                // ctx.strokeText(totalText, textXPos, textYPos);

                ctx.fillStyle = fontColor;
                ctx.fillText(totalText, textXPos, textYPos);
                ctx.restore();

                ctx.fillStyle = fontColor;
                if (config.common.maxValueText) {
                  const maxLabel = data.fullLabel || data.label;
                  const maxLabelWidth = ctx.measureText(maxLabel).width;
                  let maxValueTextXPos = textXPos;
                  const endX = config.common.singleLine ? this.chartSub.equalizerXend : xEnd;
                  if (textXPos - maxLabelWidth / 2 < xStart) {
                    maxValueTextXPos = xStart + 3;
                    ctx.textAlign = 'start';
                  } else if (textXPos + maxLabelWidth / 2 > endX) {
                    maxValueTextXPos = endX - 1;
                    ctx.textAlign = 'end';
                  }
                  // ctx.strokeStyle = theme.background
                  // ctx.lineWidth    = 3;
                  // ctx.strokeText(maxLabel, maxValueTextXPos, textYPos - 15);
                  ctx.fillText(maxLabel, maxValueTextXPos, textYPos - 15);
                }
              } else {
                ctx.fillStyle = normalColor;
                const canvasWidth = ctx.measureText(totalText).width;
                if (canvasWidth <= data.width) {
                  ctx.fillText(totalText, textXPos, textYPos);
                }
              }
            }

            yStart = yPos;
          });
        }
        ctx.restore();
      });

      ctx.restore();
    };

    private drawDot = (dot: any, config: DotConfig, index: number) => {
      if (!dot) {
        return;
      }
      const ctx = this.ctx;
      let attrs = {
        display: true,
        r: 2,
        strokeColor: dot.strokeColor,
        fillColor: dot.strokeColor,
        lineWidth: 1,
      };
      if (config && config.format) {
        const customizeAttr = config.format(dot.value, dot, index);
        attrs = Object.assign({}, attrs, customizeAttr);
      }
      if (attrs.display) {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, attrs.r, 0, 2 * Math.PI);
        ctx.fillStyle = attrs.fillColor;
        ctx.fill();
        ctx.lineWidth = attrs.lineWidth;
        ctx.strokeStyle = attrs.strokeColor;
        ctx.stroke();
      }
    };
  };
