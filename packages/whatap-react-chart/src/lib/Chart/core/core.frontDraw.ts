import { ChartAttribute, ChartType, MouseAttribute } from '../interfaces/BaseInterface';
import { ConfigAttribute } from '../interfaces/ConfigInterface';
import { LEFT_TICK_OFFSET, XTICK_TOP_MARFIN } from '../meta/offsetMeta';
import mixin from '../util/mixinBuilder';

const roundRect = (ctx, x: number, y: number, w: number, h: number, r: number) => {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);

  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.restore();
  return ctx;
};
export const FrontDrawCore = (Base: any) =>
  class extends mixin(Base).extend() {
    public frontCtx: CanvasRenderingContext2D;
    public chartType: ChartType;
    public endTime: number;
    public startTime: number;
    public timeRange: number;
    public chartAttr: ChartAttribute;
    public config: ConfigAttribute;
    public searchDot: Array<any>;
    public mouseAttr: MouseAttribute;

    public drawFrontData = () => {
      const chartType = this.chartType;

      switch (chartType) {
        case 'LineChart':
          this.drawFocus();
          this.drawPlotVerticalLine();
          this.drawHorizontalLines();
          this.drawVerticalLines();
          this.drawSelectRedLine();
          this.drawSeriesDot();
          this.drawDragArea();
          break;
      }
    };

    private drawSelectRedLine = () => {
      const selectRedLine = this.selectRedLine as number;
      if (selectRedLine) {
        this.drawTimeVerticalLine([selectRedLine, undefined], '#FF0000');
      }
    };

    private drawVerticalLines = () => {
      const verticalLine = this.config.xAxis.verticalLine;
      if (verticalLine && Array.isArray(verticalLine)) {
        const length = verticalLine.length;
        for (let i = 0; i < length; i++) {
          const { time, time2, color, text, dashed, alpha } = verticalLine[i];
          this.drawTimeVerticalLine([time, time2], color, text, dashed, alpha);
        }
      }
    };

    private drawTimeVerticalLine = (
      times: [number, number | undefined],
      color: string,
      text: string = '',
      dashed: boolean = false,
      alpha = 0.2,
    ) => {
      const getThemeData = this.palette.getThemeData;

      const lineColor = color || getThemeData('bg_info_color');
      const textColor = 'white';

      const [time, time2] = times;
      const xPos = this.timeToXPos(time);
      const xPos2 = time2 ? this.timeToXPos(time2) : undefined;

      if (!xPos) {
        return;
      }

      const { y, heightY, h, bottomY } = this.chartAttr;
      const ctx = this.frontCtx;
      ctx.save();

      ctx.strokeStyle = lineColor;
      if (dashed) {
        ctx.setLineDash([1, 2]);
      }

      ctx.beginPath();
      if (time2) {
        ctx.fillStyle = lineColor;
        ctx.globalAlpha = alpha;
        ctx.fillRect(xPos, y, xPos2 - xPos, h);
      } else {
        ctx.moveTo(xPos, y);
        ctx.lineTo(xPos, heightY);
        ctx.stroke();
      }

      if (text) {
        text = text.toString();

        const PADDING = 2;
        const TEXT_MARGIN = 4;

        const textHeightY = heightY + 0.5;
        const textWidth = ctx.measureText(text).width + PADDING * 4;
        const textTickY = textHeightY + TEXT_MARGIN + XTICK_TOP_MARFIN;
        const textX = xPos2 ? xPos2 - (xPos2 - xPos) / 2 : xPos;
        const textY = textTickY;

        const rectX = textX - textWidth / 2;
        const rectY = textHeightY + PADDING;
        const rectW = textWidth;
        const rectH = bottomY - PADDING * 2;

        ctx.globalAlpha = 1;

        ctx.beginPath();
        ctx.moveTo(textX, heightY);
        ctx.lineTo(textX, textHeightY + PADDING);
        ctx.strokeStyle = lineColor;
        ctx.setLineDash([]);
        ctx.stroke();

        ctx.fillStyle = lineColor;
        roundRect(ctx, rectX, rectY, rectW, rectH, 2);
        ctx.fill();

        ctx.strokeStyle = getThemeData('bg_color_component');
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = textColor;
        ctx.fillText(text, textX, textY);
      }

      ctx.restore();
    };

    private drawHorizontalLines = () => {
      const draw = (list?: any) => {
        if (!list || !Array.isArray(list)) {
          return;
        }
        const length = list.length;
        const ctx = this.frontCtx;
        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([2, 3]);
        for (let i = 0; i < length; i++) {
          const { value, value2, title } = list[i];
          const color = this.store.theme[list[i].color] || list[i].color;
          this.drawValueHorziontalLine([value, value2], color, title);
        }
        ctx.restore();
      };
      draw(this.config.yAxis.horizontalLine);
      draw(this.customChartOptions.horizontalLine);
    };

    private drawValueHorziontalLine = (values: [number, number | undefined], color: string, text?: string) => {
      const [value, value2] = values;
      const format = this.config.yAxis.tick.format;
      const yPos = this.valueToYPos(value);
      if (typeof value2 !== 'number' && value > this.maxValue) {
        return;
      }
      if (!yPos) {
        return;
      }
      const ctx = this.frontCtx;
      if (!this.prevMouseEvent) {
        ctx.globalAlpha = 0.6;
      }
      const { x, widthX, w } = this.chartAttr;
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.beginPath();
      if (typeof value2 === 'number') {
        const yPos2 = this.valueToYPos(value2);
        ctx.save();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x, yPos, w, yPos2 - yPos);
        ctx.restore();
      } else {
        ctx.moveTo(x, yPos);
        ctx.lineTo(widthX, yPos);
        ctx.stroke();

        // drawText
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const formatText = format ? format(value, this.yTickAttr) : value.toString();
        const textWidth = ctx.measureText(formatText).width;
        ctx.beginPath();
        ctx.moveTo(x, yPos);
        ctx.lineTo(x - LEFT_TICK_OFFSET, yPos - 9);
        ctx.lineTo(x - LEFT_TICK_OFFSET - textWidth - 3, yPos - 9);
        ctx.lineTo(x - LEFT_TICK_OFFSET - textWidth - 3, yPos + 9);
        ctx.lineTo(x - LEFT_TICK_OFFSET, yPos + 9);
        ctx.fill();
        ctx.fillStyle = '#FFF';
        ctx.fillText(formatText, x - LEFT_TICK_OFFSET, yPos);
        ctx.restore();
      }
      if (text) {
        ctx.setLineDash([]);
        ctx.strokeStyle = this.store.theme.bg_color_component;
        ctx.lineWidth = 3;
        ctx.strokeText(text, x + 2, yPos - 2);
        ctx.fillText(text, x + 2, yPos - 2);
      }
      ctx.restore();
    };

    private drawDragArea = () => {
      const ctx = this.frontCtx;
      const config = this.config;
      const mouseAttr = this.mouseAttr;
      const { x, y, widthX, h } = this.chartAttr;

      if (config.common.dragCallback && mouseAttr.drag) {
        let x1;
        let x2;
        if (mouseAttr.x1 > mouseAttr.x2) {
          x1 = mouseAttr.x1;
          x2 = mouseAttr.x2;
        } else {
          x1 = mouseAttr.x2;
          x2 = mouseAttr.x1;
        }

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.store.theme?.color?.semantic?.background_secondary_hover || 'rgba(36, 40, 48, 0.4)';
        ctx.fillRect(x1, y, x2 - x1, h);
        ctx.restore();
      }
    };

    private drawPlotVerticalLine = () => {
      const ctx = this.frontCtx;
      const config = this.config;
      const searchDot = this.searchDot;

      if (config.common.plotVerticalLine && this.hoverTime) {
        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([1, 2]);
        ctx.strokeStyle = this.themeId === 'bk' ? 'white' : '#666666';
        const { y, heightY } = this.chartAttr;
        ctx.moveTo(this.hoverTimePos, y);
        ctx.lineTo(this.hoverTimePos, heightY);
        ctx.stroke();
        ctx.restore();
      }
    };

    private drawSeriesDot = () => {
      const ctx = this.frontCtx;
      const searchDot = this.searchDot;
      const chartAttr = this.chartAttr;
      const { x, y, w, h, widthX, heightY } = chartAttr;

      if (this.config.dot.display && this.config.dot.format) {
        this.dots.forEach((dotList: any) => {
          dotList.forEach((dot, i) => {
            const dotConfig = this.config.dot.format(dotList, dot, i);
            if (dotConfig.display) {
              ctx.save();
              ctx.beginPath();
              ctx.fillStyle = dotConfig.fillColor;
              ctx.lineWidth = dotConfig.lineWidth;
              ctx.strokeStyle = dotConfig.strokeColor;
              ctx.arc(dot.x, dot.y, dotConfig.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              ctx.restore();
            }
          });
        });
      }

      if (searchDot && searchDot.length) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, w - 2, h - 2);
        ctx.clip();
        ctx.strokeStyle = '#FFFFFF';
        searchDot.map((dot, idx) => {
          const { x, y, strokeColor } = dot;

          ctx.save();
          ctx.fillStyle = strokeColor;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });
        ctx.restore();
      }
    };

    private drawFocus = () => {
      const config = this.config;
      const focus = config.common.focus;
      if (focus && focus.stime && focus.etime) {
        const ctx = this.frontCtx;
        const timeRange = this.endTime - this.startTime;
        ctx.save();
        ctx.beginPath();
        const { x, y, w, h, widthX } = this.chartAttr;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

        if (focus.stime >= this.startTime) {
          const width = Math.round(w * ((focus.stime - this.startTime) / timeRange)) + 0.5;
          ctx.fillRect(x, y, width, h);
        }

        if (focus.etime >= this.startTime && focus.etime <= this.endTime) {
          const width = Math.round(w * ((focus.etime - this.startTime) / timeRange)) + 0.5;
          ctx.fillRect(widthX, y, -(w - width), h);
        }

        ctx.restore();
      }
    };
  };
