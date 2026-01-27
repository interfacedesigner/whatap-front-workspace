//80px 마다 tick 2개씩
import { getMaxValue } from '../helper/helper.value';
import { ChartAttribute, ChartType, TickAttribute } from '../interfaces/BaseInterface';
import { ConfigAttribute } from '../interfaces/ConfigInterface';
import { FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import { LEFT_TICK_OFFSET } from '../meta/offsetMeta';

const INTERVAL = 80; //80px 마다 tick 2개씩

export const YTickCore = (Base: any) =>
  class extends Base {
    public plots: number;
    public ctx: CanvasRenderingContext2D;
    public chartAttr: ChartAttribute;
    public maxValue: number;
    public config: ConfigAttribute;
    public yTickAttr?: TickAttribute;
    public chartSubtype: ChartType;

    public setPlotsAndMaxValue = () => {
      //plots 지정, plots이 변한 경우 maxVlaue지정
      const prevPlots = this.plots;
      this.plots = this.setPlots();

      if (prevPlots !== this.plots) {
        this.setMaxValueAndWidth();
      }
    };

    public drawYTick = () => {
      const { chartAttr, ctx, maxValue, plots, config } = this;
      const getThemeData = this.palette.getThemeData;
      const yAxis = config.yAxis;
      const format = yAxis.tick.format;
      const interval = maxValue / plots;

      const isRight = this.chartSubtype === 'TopnLineChart';
      const tickX = isRight ? chartAttr.widthX + LEFT_TICK_OFFSET : chartAttr.x - LEFT_TICK_OFFSET;
      const x = isRight ? chartAttr.widthX - 0.5 : chartAttr.x + 0.5;
      const isInnerText = yAxis.textPosition === 'inner';
      const xPos = isInnerText ? x + this.maxValueWidth + LEFT_TICK_OFFSET : x;

      ctx.save();

      ctx.textAlign = isRight ? 'left' : 'right';
      ctx.textBaseline = 'middle';
      ctx.beginPath();
      ctx.fillStyle = getThemeData('bg_font_color');
      ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;

      ctx.save();
      for (let i = 0; i <= plots; i++) {
        const value = interval * i;
        const y = Math.round(chartAttr.h - chartAttr.h * (value / maxValue) + chartAttr.y) + 0.5;

        if (yAxis.plotLine.display) {
          ctx.strokeStyle = getThemeData('border_guide_color');
          ctx.setLineDash([2, 1]);
          ctx.moveTo(xPos, y);
          ctx.lineTo(chartAttr.widthX, y);
        }

        if (yAxis.tick.display && !isInnerText) {
          ctx.fillText(format ? format(value, this.yTickAttr) : value.toString(), tickX, y);
        }
      }

      if (yAxis.plotLine.display) {
        ctx.stroke();
      }
      ctx.restore();

      if (yAxis.axisLine.display) {
        // drawAxisLine
        ctx.beginPath();
        ctx.strokeStyle = getThemeData('bg_normal_color');
        ctx.moveTo(x, chartAttr.y);
        ctx.lineTo(x, chartAttr.heightY);
        ctx.stroke();
      }
      ctx.restore();
    };

    public drawPostYTick = () => {
      const { chartAttr, ctx, maxValue, plots, config } = this;
      const yAxis = config.yAxis;
      const isInnerText = yAxis.textPosition === 'inner';
      const getThemeData = this.palette.getThemeData;
      if (!isInnerText || !yAxis.tick.display) {
        return;
      }

      const format = yAxis.tick.format;
      const interval = maxValue / plots;
      const tickX = chartAttr.x + this.maxValueWidth;

      ctx.save();

      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = 1.5;

      ctx.fillStyle = getThemeData('bg_color_component');
      ctx.strokeStyle = getThemeData('bg_color_component');
      ctx.globalAlpha = 0.6;
      ctx.fillRect(chartAttr.x, chartAttr.y, this.maxValueWidth + LEFT_TICK_OFFSET, chartAttr.h);
      ctx.globalAlpha = 1;
      ctx.fillStyle = getThemeData('bg_normal_color');
      for (let i = 0; i <= plots; i++) {
        const value = interval * i;
        const y =
          i > 0
            ? Math.round(chartAttr.h - chartAttr.h * (value / maxValue) + chartAttr.y) + 0.5
            : chartAttr.heightY - 6;
        ctx.strokeText(format ? format(value, this.yTickAttr) : value.toString(), tickX, y);
        ctx.fillText(format ? format(value, this.yTickAttr) : value.toString(), tickX, y);
      }

      ctx.restore();
    };

    public setMaxValueAndWidth = () => {
      //maxValue, maxValueWidth 지정
      const { dataMaxValue, plots, ctx, chartSub, customChartOptions } = this;
      const format = this.config.yAxis.tick.format;
      const unitDivider = this.config.yAxis.unitDivider;
      const integerOnly = this.config.yAxis.integerOnly;

      let yTickAttr;
      const customMaxValue = customChartOptions.maxY && customChartOptions.maxY.use && customChartOptions.maxY.value;
      if (!this.config.yAxis.maxValue && !customMaxValue) {
        yTickAttr = getMaxValue(
          (chartSub.stackMaxValue ? chartSub.stackMaxValue : dataMaxValue) || 1,
          plots,
          unitDivider,
          integerOnly,
        );
        this.maxValue = yTickAttr.maxValue;
        if (this.config.meta?.isDataLoaded) {
          this.config?.yAxis?.onChangeMaxYValue?.({
            maxValue: yTickAttr.maxValue,
            powValue: yTickAttr.powValue,
            unitDivider: yTickAttr.unitDivider,
          });
        }
      } else {
        this.maxValue = this.config.yAxis.maxValue;
      }

      if (customMaxValue) {
        this.maxValue = customMaxValue;
      }
      this.yTickAttr = yTickAttr;

      let maxValueWidth = 0;

      const interval = this.maxValue / this.plots;

      for (let i = 1; i <= this.plots; i++) {
        const value = interval * i;
        const width = Math.ceil(ctx.measureText(format ? format(value, yTickAttr) : value.toString()).width);
        if (maxValueWidth < width) {
          maxValueWidth = width;
        }
      }

      // if (this.chartSubtype === 'TopnLineChart') {
      // }

      this.maxValueWidth = maxValueWidth;
    };

    private setPlots = () => {
      const { h } = this.chartAttr;

      const plots = this.config.yAxis.plotCount || Math.floor((h + INTERVAL / 2) / INTERVAL) * 2;

      return plots || 1;
    };

    public valueToYPos = (value: number) => {
      const { y, h } = this.chartAttr;
      if (value < 0) {
        return 0;
      }
      if (this.maxValue < value) {
        return y;
      }

      return Math.round(y + (h - h * (value / this.maxValue))) + 0.5;
    };
  };
