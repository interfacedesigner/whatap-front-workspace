import { ChartAttribute, ChartType } from '../interfaces/BaseInterface';

/**
 * @mixin AxisCore
 * @param { class } Base
 * @description This part draws the
 */

//Axis 더이상 사용되지 않습니다. xTick, yTick을 이용해주세요
export const AxisCore = (Base: any) =>
  class extends Base {
    public ctx: CanvasRenderingContext2D;
    public chartType: ChartType;
    public chartAttr: ChartAttribute;
    public yValueMax: number;
    public columnBlockCount: number;

    public drawAxis = () => {
      const chartType = this.chartType;

      switch (chartType) {
        case 'HitmapChart':
          // this.drawGridLine();
          this.drawHitmapAxisLine();
          break;
        case 'LineChart':
          this.drawLineChartAxisLine();
          break;
        case 'HorizontalBarChart':
          break;
      }
    };

    public drawGridLine = () => {
      this.drawHitmapYLine();
      this.drawHitmapXLine();
    };

    public drawLineChartAxisLine = () => {
      /** @todo line chart */
      const ctx = this.ctx;
      const theme = this.theme;
      const { x, y, w, h } = this.chartAttr;

      const underY = parseInt(y + h);

      ctx.save();
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.strokeStyle = theme.topAxisLIne;
      ctx.moveTo(x, underY + 0.5);
      ctx.lineTo(x + w, underY + 0.5);
      ctx.stroke();

      ctx.restore();
    };

    public drawHitmapAxisLine = () => {
      const ctx = this.ctx;
      const theme = this.theme;
      const { x, y, w, h } = this.chartAttr;

      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = this.palette.getThemeData('bg_normal_color');

      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.stroke();

      ctx.restore();
    };

    private drawHitmapXLine = () => {
      const ctx = this.ctx;
      const config = this.config;
      const theme = this.theme;
      const xGridLineInterval = config.xAxis.gridLine.interval;
      const duration = this.duration;
      let interval = this.interval;

      //If the grid lines are too close, correction the interval
      while (duration / interval > 200) {
        interval = interval * 2;
      }

      const { x, y, w, h } = this.chartAttr;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.beginPath();
      ctx.setLineDash([1, 2]);
      ctx.strokeStyle = this.palette.getThemeData('border_guide_color');
      const lineIntervalTime = interval * xGridLineInterval;
      const gridLineStartTime =
        this.hitmapXStartTime || this.startTime - (this.startTime % lineIntervalTime) + lineIntervalTime;
      for (let currentTime = gridLineStartTime; ; currentTime += lineIntervalTime) {
        const posPercent = (currentTime - this.startTime) / duration;
        const calculatedX = posPercent * w + x;
        ctx.moveTo(calculatedX, y);
        ctx.lineTo(calculatedX, y + h);
        if (posPercent > 1) {
          break;
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    private drawHitmapYLine = () => {
      const config = this.config;
      const ctx = this.ctx;
      const theme = this.theme;
      const yGridLineInterval = config.yAxis.gridLine.interval;
      const { x, y, w, h } = this.chartAttr;
      const columnBlockCount = config.hitmap.columnBlockCount;
      const unit = (h / columnBlockCount) * yGridLineInterval;

      ctx.save();
      ctx.beginPath();
      ctx.setLineDash([1, 2]);
      ctx.strokeStyle = this.palette.getThemeData('border_guide_color');
      for (let idx = 0; idx < columnBlockCount / yGridLineInterval; idx++) {
        const calculatedY = y + unit * idx;
        ctx.moveTo(x, calculatedY);
        ctx.lineTo(x + w, calculatedY);
      }
      ctx.stroke();
      ctx.restore();
    };

    public drawPlotLine = () => {
      /** @todo */
    };
  };
