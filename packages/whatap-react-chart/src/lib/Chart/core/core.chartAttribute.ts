import { ChartAttribute, ChartType } from '../interfaces/BaseInterface';
import { ConfigAttribute } from '../interfaces/ConfigInterface';
import { BOTTOM_TICK_OFFSET, LEFT_TICK_OFFSET, RIGHT_TICK_MARGIN, TOP_DEFAULT_OFFSET } from '../meta/offsetMeta';

export const ChartAttributeCore = (Base: any) =>
  class extends Base {
    public chartAttr: ChartAttribute;
    public config: ConfigAttribute;
    public chartType: ChartType;
    public chartSubtype: ChartType;

    public setChartAttribute = () => {
      const config = this.config;

      this.chartAttr = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        rightX: 0,
        bottomY: 0,
        widthX: 0,
        heightY: 0,
      };
    };

    public setChartAttributeY = () => {
      this.setChartAttributeBottom();
      this.setChartAttributeTop();
      this.setChartAttributeHegiht();
    };

    public setChartAttributeX = () => {
      this.setChartAttributeLeft();
      this.setChartAttributeRight();
      this.setChartAttributeWidth();
    };

    private setChartAttributeBottom = () => {
      const { yAxis, common } = this.config;
      const { tick } = yAxis;
      const { offset } = common;
      let contentHeight = 0;
      let bottomOffset = 0;

      if (offset && offset.bottom) {
        bottomOffset = offset.bottom;
      }

      if (tick && tick.display) {
        contentHeight += BOTTOM_TICK_OFFSET;
      }

      this.chartAttr.bottomY = contentHeight + bottomOffset;
    };

    private setChartAttributeTop = () => {
      const { common } = this.config;
      const { offset } = common;
      let topOffset = 0;
      if (offset && offset.top) {
        topOffset = offset.top;
      }

      let totalOffset = TOP_DEFAULT_OFFSET + topOffset;

      if (common.plotMaxValue) {
        if (totalOffset < 22) {
          totalOffset = 22;
        }
      }
      this.chartAttr.y = totalOffset;
    };

    private setChartAttributeHegiht = () => {
      const { bcRect, chartAttr } = this;
      const { height } = bcRect;
      const { y, bottomY } = chartAttr;

      let h = height - y - bottomY;

      chartAttr.h = h > 0 ? h : 1;
      chartAttr.heightY = chartAttr.h + chartAttr.y;
    };

    private setChartAttributeLeft = () => {
      const { maxValueWidth, config, chartAttr, chartSubtype } = this;
      const { offset } = config.common;
      let leftOffset = 0;

      if (offset && offset.left) {
        leftOffset = offset.left;
      }

      if (chartSubtype === 'TopnLineChart') {
        chartAttr.x = leftOffset;
      } else {
        let contentWidth = 0;
        if (config.xAxis.tick && config.xAxis.tick.display && config.yAxis.textPosition !== 'inner') {
          contentWidth += maxValueWidth + LEFT_TICK_OFFSET;
          if (Array.isArray(config.yAxis.horizontalLine)) {
            let maxWidth = 0;
            config.yAxis.horizontalLine.forEach((line) => {
              const value = line.value;
              if (typeof value === 'number' && typeof line.value2 !== 'number') {
                const format = this.config.yAxis.tick.format;
                const formatText = format ? format(value, this.yTickAttr) : value.toString();
                const textWidth = this.ctx.measureText(formatText).width;
                if (textWidth > maxWidth) {
                  maxWidth = textWidth;
                }
              }
            });
            if (maxWidth) {
              maxWidth += 6;
              if (maxWidth > contentWidth) {
                contentWidth = maxWidth;
              }
            }
          }
        }
        chartAttr.x = leftOffset + contentWidth;
      }
    };

    private setChartAttributeRight = () => {
      const { maxValueWidth, config, chartAttr, chartSubtype } = this;
      const { offset } = config.common;
      let rightOffset = 0;
      if (offset && offset.right) {
        rightOffset = offset.right;
      }

      if (this.chartSubtype === 'TopnLineChart') {
        let contentWidth = 0;
        if (config.xAxis.tick && config.xAxis.tick.display && config.yAxis.textPosition !== 'inner') {
          contentWidth += maxValueWidth + LEFT_TICK_OFFSET + RIGHT_TICK_MARGIN;
        }
        chartAttr.rightX = rightOffset + contentWidth;
      } else {
        chartAttr.rightX = rightOffset;
      }
    };

    private setChartAttributeWidth = () => {
      const { bcRect, chartAttr } = this;
      const { width } = bcRect;

      const { x, rightX } = chartAttr;
      chartAttr.w = width - x - rightX;
      chartAttr.widthX = chartAttr.w + chartAttr.x;
    };
  };
