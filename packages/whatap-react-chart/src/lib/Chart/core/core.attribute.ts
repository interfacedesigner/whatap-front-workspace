import { EqualizerHelper } from '../helper/helper.equalizerBar';
import { HitmapHelper } from '../helper/helper.hitmap';
import { SeriesChartHelper } from '../helper/helper.seriesChart';
import { ChartAttribute, ChartType } from '../interfaces/BaseInterface';
import { ConfigAttribute } from '../interfaces/ConfigInterface';
import {
  CANVAS_NON_TICK_SIDE_OFFSET,
  CANVAS_NON_TICK_TOPBOTTOM_OFFSET,
  CANVAS_TICK_BOTTOM_OFFSET,
  CANVAS_TICK_SIDE_OFFSET,
  CANVAS_TICK_TOPBOTTOM_OFFSET,
  CHART_NON_TICK_OFFSET_X,
  CHART_YTICK_SPACE,
} from '../meta/globalMeta';
import mixin from '../util/mixinBuilder';

function applyOffset(value: number, offset: number, add: number = 0) {
  return value + offset + add;
}

function modulateValue(value: number) {
  if (value > 0) {
    return value;
  } else {
    return 0;
  }
}

/**
 * @mixin AttributeCore
 * @param { class } Base
 * @description Core element for settingup Chart attributes. This core defines the chart drawn position.
 */

// core.attribute는 더 이상 사용되지 않습니다. core.chartAttribute 를 이용해주세요
export const AttributeCore = (Base: any) =>
  class extends mixin(Base).extend(SeriesChartHelper, HitmapHelper, EqualizerHelper) {
    public chartAttr: ChartAttribute;
    public config: ConfigAttribute;
    public chartType: ChartType;
    public setBackground = () => {
      const chartType: ChartType = this.chartType;

      this.chartAttr = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        rightX: 0,
        bottomY: 0,
      };

      switch (chartType) {
        /**
         * New charts will comply `AxisCore` rules.
         */
        case 'HitmapChart':
          this.measureMaxValue();
          this.setChartAttr();
          break;
        case 'LineChart':
          break;
        case 'HorizontalBarChart':
          this.setChartAttrY();
          this.setChartAttrX();
          break;
        default:
          this.setChartAttr();
      }
    };

    public setAttribute = () => {
      const chartType: ChartType = this.chartType;
      const config = this.config;

      switch (chartType) {
        case 'HitmapChart':
          /**
           * helper.hitmap에 있음
           * `setHitmapTimestamp` must come before `setHitmapBlockSize`
           */
          this.setHitmapTimestamp();
          this.setHitmapBlockSize();

          /**
           * `setHitmapTickCount`는 x / y 축에 그려지는 tick의 갯수를 반환한다. Canvas크기에 영향을 받는다.
           */
          this.setHitmapTickCount();
          break;
        case 'LineChart':
          /** @todo Line Chart related helpers go here */
          if (!config.common.isStatic) {
            this.setLiveTimestamp();
          }
          break;
        case 'EqualizerChart':
          this.setEqualizerMaxValue();
          break;
      }
    };

    private setChartAttr = () => {
      this.setChartAttrX();
      this.setChartAttrY();
    };

    private setChartAttrX = () => {
      this.chartAttr.xCeil = this.getChartCeilX(); // 축 영역의 너비 (값에 대한 텍스트 영역은 포함하지 않음)
      this.chartAttr.x = this.getChartPosX(); // 축 영역 + 값에 대한 텍스트 영역 + 오프셋 영역 인 차트 그림의 시작점 X
      this.chartAttr.w = this.getChartWidth();
    };

    private setChartAttrY = () => {
      this.chartAttr.y = this.getChartPosY();
      this.chartAttr.bottomY = this.getChartBottomY();
      this.chartAttr.h = this.getChartHeight();
    };

    private getChartCeilX = () => {
      const config = this.config;
      if (config.yAxis.tick && config.yAxis.tick.display) {
        return CANVAS_TICK_SIDE_OFFSET;
      } else {
        return CANVAS_NON_TICK_SIDE_OFFSET;
      }
    };

    /**
     * Set `horizontal` starting point
     */
    private getChartPosX = () => {
      const config = this.config;
      const maxValueWidth = this.maxValueWidth;
      const chartAttr = this.chartAttr;
      let LEFT_OFFSET = CHART_NON_TICK_OFFSET_X;
      if (config.common && typeof config.common.offset === 'number') {
        LEFT_OFFSET = config.common.offset;
      }

      if (config.yAxis.tick && config.yAxis.tick.display) {
        return applyOffset(maxValueWidth, LEFT_OFFSET, chartAttr.xCeil);
      } else {
        return applyOffset(chartAttr.xCeil, LEFT_OFFSET);
      }
    };

    private getChartWidth = () => {
      const config = this.config;
      const bcRect = this.bcRect;
      const chartAttr = this.chartAttr;
      const RIGHT_OFFSET = (config.common.offset && config.common.offset.right) || 0;

      const chartWidth = bcRect.width - chartAttr.x - chartAttr.xCeil - RIGHT_OFFSET;
      return modulateValue(chartWidth);
    };

    /**
     * Set `vertical` starting point
     */
    private getChartPosY = () => {
      const config = this.config;
      const offset = config.common.offset;
      const yTick = config.yAxis.tick;
      const TICK_OFFSET = yTick && yTick.display ? CANVAS_TICK_TOPBOTTOM_OFFSET : CANVAS_NON_TICK_TOPBOTTOM_OFFSET;
      const TOP_OFFSET = (offset && offset.top) || 0;

      return TOP_OFFSET + TICK_OFFSET;
    };

    private getChartBottomY = () => {
      const config = this.config;
      const xTick = config.xAxis.tick;
      const offset = config.common.offset;
      const TICK_OFFSET = xTick && xTick.display ? CANVAS_TICK_BOTTOM_OFFSET : CANVAS_NON_TICK_TOPBOTTOM_OFFSET;
      const BOTTOM_OFFSET = (offset && offset.bottom) || 0;

      return TICK_OFFSET + BOTTOM_OFFSET;
    };

    private getChartHeight = () => {
      const config = this.config;
      const bcRect = this.bcRect;
      const { y, bottomY } = this.chartAttr;

      return modulateValue(bcRect.height - (y + bottomY));
    };
  };
