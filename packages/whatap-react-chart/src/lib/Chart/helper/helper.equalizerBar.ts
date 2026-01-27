import dayjs from 'dayjs';

import { BarChartDotInterface, BarChartDots } from '../interfaces/BarChartInterface';
import { EqualizerChartConfigAttribute } from '../interfaces/ConfigInterface';
import { FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import * as Tooltip from './helper.tooltip';
import { definePlotCount, getMaxValue, widthCuttingText } from './helper.value';

const BAR_MAX_SIZE = 100;
const DEFAULT_BAR_MIN_SIZE = 30;
const BAR_MARGIN = 2;

export const EqualizerHelper = (Base: any) =>
  class extends Base {
    public config: EqualizerChartConfigAttribute;
    public ctx: CanvasRenderingContext2D;
    public dots: BarChartDots;

    public setEqualizerAreaCount = () => {
      const { x, y, w, h, bottomY } = this.chartAttr;
      const { height } = this.bcRect;
      const lineCount = this.data.length || 1;
      let BAR_MIN_SIZE = this.config.common.minWidth || DEFAULT_BAR_MIN_SIZE;
      if (this.config.xAxis.width) {
        BAR_MIN_SIZE = this.config.xAxis.width;
      }
      const lineMinWidth = lineCount * BAR_MIN_SIZE;
      if (this.config.common.singleLine) {
        this.areaCount = 1;
        BAR_MIN_SIZE = 2;
      } else {
        this.areaCount = Math.ceil(lineMinWidth / (w || 1));
      }

      if (this.areaCount > lineCount) {
        this.areaCount = lineCount;
      }
      this.areaHeight = this.config.yAxis.height || height / this.areaCount;
      this.areaDrawHeight = this.areaHeight - (y + bottomY);
      if (this.areaDrawHeight < 0) {
        this.areaDrawHeight = 0;
      }
      this.plotCount = this.config.yAxis.plots || definePlotCount(this.areaDrawHeight);
    };

    public setEqualizerDots = () => {
      const ctx = this.ctx;
      let { x, y, h, bottomY, xCeil } = this.chartAttr;
      const w = this.baseDom.clientWidth - x - xCeil;
      const xEndPos = x + w;
      const datas = this.data;
      const dataLength = datas.length;
      const areaCount = this.areaCount;
      const areaHeight = this.areaHeight;
      const areaDrawHeight = this.areaDrawHeight; // 아래 영역의 패딩과 라벨 텍스트를 제외한 드로우 영역 (실제 차트가 그려지는 영역)
      const newDots: BarChartDots = [];
      const maxValue = this.maxValue;
      const dataMaxValue = this.dataMaxValue;
      ctx.save();
      ctx.font = `11px ${FONT_TYPE}`;
      let BAR_MIN_SIZE = this.config.common.minWidth || DEFAULT_BAR_MIN_SIZE;
      if (bottomY > areaHeight) {
        bottomY = areaHeight;
      }
      if (this.config.common.singleLine) {
        BAR_MIN_SIZE = 4;
      } // width 뷰 포트가 넘칠 경우 가로 스크롤

      let areaWidth = this.config.xAxis.width || Math.floor(w / dataLength);
      if (areaWidth > BAR_MAX_SIZE) {
        areaWidth = BAR_MAX_SIZE;
      }
      if (areaWidth < BAR_MIN_SIZE) {
        areaWidth = BAR_MIN_SIZE;
      }
      let margin = BAR_MARGIN;
      if (margin >= areaWidth / 4) {
        margin = areaWidth / 4;
      }
      const barWidth = areaWidth - margin * 2;
      if (typeof this.config.common.onChangeSize === 'function') {
        if (this.chartSub.barWidth !== barWidth) {
          this.chartSub.barWidth = barWidth;
          this.config.common.onChangeSize(barWidth);
        }
      }

      let dataIndex = 0;
      let maxValueIndex: boolean | number = false;
      const centerIndex = dataLength / 2;

      let endX = 0;
      for (let areaIndex = 1; areaCount >= areaIndex; areaIndex++) {
        const endY = areaIndex * areaHeight;
        let x1 = x;
        const y2 = endY - bottomY - 1;
        const y1 = y2 - areaDrawHeight;

        const maxX1 = xEndPos - areaWidth; //while 조건 전용
        while (dataIndex < dataLength && (x1 <= maxX1 || this.config.common.singleLine)) {
          const data = datas[dataIndex];
          if (data.total === dataMaxValue) {
            if (typeof maxValueIndex === 'number') {
              if (Math.abs(centerIndex - dataIndex) < Math.abs(centerIndex - maxValueIndex)) {
                maxValueIndex = dataIndex;
              }
            } else {
              maxValueIndex = dataIndex;
            }
          }
          const x2 = x1 + areaWidth;
          let lastIndex = false;
          const dotData = data.data.map((data, idx) => {
            const returnData = { ...data };
            let percentInMax = 0;
            if (data.data) {
              lastIndex = idx;
              percentInMax = data.data / maxValue;
            }

            returnData.percentInMax = percentInMax;
            returnData.height = areaDrawHeight * percentInMax;
            return returnData;
          });

          if (typeof lastIndex === 'number') {
            dotData[lastIndex]['last'] = true;
          }

          const dot: BarChartDotInterface = {
            x1: x1 + BAR_MARGIN,
            x2: x2 - BAR_MARGIN,
            width: barWidth,
            minX: x1,
            maxX: x2,
            minY: y1,
            maxY: y2,
            rowData: data.rowData || data,
            total: data.total,
            label: data.key,
            fullLabel: data.fullKey,
            active: data.active,
            cuttingLabel: widthCuttingText(ctx, data.key, areaWidth - 1, this.config.common.textCuttingDirection),
            data: dotData,
          };

          newDots.push(dot);
          dataIndex++;
          x1 = x2;
        }
        if (endX < x1) {
          endX = x1;
        }
      }
      if (this.config.common.singleLine) {
        this.resizeParentDomSize(endX);
      }

      if (typeof maxValueIndex === 'number') {
        newDots[maxValueIndex].isMaxValue = true;
      }
      this.dots = newDots;
      ctx.restore();
    };

    public setEqualizerMaxValue = () => {
      const ctx = this.ctx;
      const data = this.data;
      ctx.save();
      ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;

      let maxValue = 0;

      data.map((ds, i) => {
        if (ds.total) {
          if (ds.total > maxValue) {
            maxValue = ds.total;
          }
        }
      });

      this.maxValue = this.config.yAxis.maxValue || getMaxValue(maxValue, this.plotCount, 1000, true).maxValue;
      this.dataMaxValue = maxValue;

      this.maxValueWidth = ctx.measureText(this.config.format.value(this.maxValue)).width;
      ctx.restore();
    };
  };

export const getEqualizerTooltipText = (
  dot: BarChartDotInterface,
  config: EqualizerChartConfigAttribute,
): HTMLElement => {
  const dom = document.createElement('div');
  dom.appendChild(Tooltip.getTitleText(dot.fullLabel || dot.label));
  if (typeof dot.active === 'boolean' && !dot.active) {
    if (dot.rowData.time) {
      dom.appendChild(Tooltip.getSubTitleText('Inactive timming'));
      dom.appendChild(Tooltip.getTitleText(dayjs(dot.rowData.time).format('YYYY-MM-DD HH:mm:ss')));
    } else {
      dom.appendChild(Tooltip.getSubTitleText('Inactive'));
    }
  } else {
    if (dot.data.length >= 2) {
      dom.appendChild(Tooltip.getSubTitleText(config?.tooltip?.label?.totalName || 'Total'));
    }
    dom.appendChild(Tooltip.getStrongText(config.format.value(dot.total)));

    // labels
    dot.data.map((value, idx) => {
      if (value.key) {
        let childDom;
        if (dot.data.length === 1) {
          childDom = Tooltip.getTitleText(value.key);
        } else {
          childDom = Tooltip.getTitleValueText(
            value.key,
            typeof value.data === 'number' ? config.format.value(value.realData || value.data) : 'No Data',
            value.color,
          );
        }
        if (idx === 0) {
          childDom.style.marginTop = '2px';
        }
        dom.appendChild(childDom);
      }
    });

    // extraTooltipData: 차트에는 표시하지 않고 툴팁에만 표시할 추가 데이터
    if (dot.rowData?.extraTooltipData && Array.isArray(dot.rowData.extraTooltipData)) {
      dot.rowData.extraTooltipData.forEach(
        (extra: { key: string; data: number; color?: string; format?: (v: number) => string }, idx: number) => {
          if (!extra.key) {
            return;
          }

          let formattedValue: string;
          if (typeof extra.data !== 'number') {
            formattedValue = 'No Data';
          } else if (extra.format) {
            formattedValue = extra.format(extra.data);
          } else {
            formattedValue = extra.data.toLocaleString();
          }

          const childDom = Tooltip.getTitleValueText(extra.key, formattedValue, extra.color);

          if (idx === 0 && dot.data.length === 0) {
            childDom.style.marginTop = '2px';
          }

          dom.appendChild(childDom);
        },
      );
    }
  }
  return dom;
};

export const getHorizontalBarTooltipText = (
  dot: BarChartDotInterface,
  config: EqualizerChartConfigAttribute,
): HTMLElement => {
  const dom = document.createElement('div');
  dom.appendChild(Tooltip.getTitleText(dot.title));

  const datas = dot.datas;
  let sum = datas.reduce((sum, data) => {
    return sum + data.value;
  }, 0);
  const format = config?.format?.value;
  dom.appendChild(Tooltip.getStrongText(format ? format(sum, dot) : sum));

  return dom;
};
