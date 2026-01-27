import { getDayInterval, getFormatFunction, getTimeInterval } from '../helper/helper.time';
import { ChartAttribute } from '../interfaces/BaseInterface';
import { ConfigAttribute } from '../interfaces/ConfigInterface';
import { FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import { XTICK_MARGIN, XTICK_TOP_MARFIN } from '../meta/offsetMeta';
import * as PLOT from '../meta/plotMeta';

export const XTickCore = (Base: any) =>
  class extends Base {
    public ctx: CanvasRenderingContext2D;
    public chartAttr: ChartAttribute;
    public config: ConfigAttribute;
    public endTime: number;
    public startTime: number;
    public themeId: string;
    private xTickAttr: {
      timeInterval: number;
      format: Function;
      topTick: {
        status: boolean;
        interval: number;
        format: Function;
        sTime: number;
      };
    };

    constructor() {
      super();

      this.xTickAttr = {
        timeInterval: 60000,
        format: getFormatFunction(),
        topTick: {
          status: false,
          interval: 0,
          format: () => {},
          sTime: 0,
        },
      };
    }

    public setDefaultTimezone = () => {
      //기본 타임존을 설정, (기본 10분 전 ~ 현재) 옵션에 지정한 값에 따라서 달라진다.
      const config = this.config;
      this.endTime = 0;
      this.startTime = 0;

      if (config.common.postRender) {
        const postRender = config.common.postRender;
        this.endTime = postRender.endTime;
        this.startTime = postRender.startTime;
      } else {
        this.endTime = Date.now();
        if (config.xAxis.timeDiff) {
          this.startTime = this.endTime - config.xAxis.timeDiff;
        } else {
          this.startTime = this.endTime - PLOT.TEN_MIN_IN_MILLIS;
        }
      }

      this.setIntervalAndFormat();
    };

    public drawXTick = () => {
      const { chartAttr, ctx, config, startTime, endTime, xTickAttr, palette } = this;
      const getThemeData = palette.getThemeData;
      const { timeInterval, topTick } = xTickAttr;
      const xAxis = config.xAxis;
      const yInner = config.yAxis.textPosition === 'inner';

      const heightY = chartAttr.heightY + 0.5;
      const tickY = heightY + 4 + XTICK_TOP_MARFIN;
      const x = chartAttr.x + 0.5;
      const widthX = chartAttr.widthX + 0.5;
      const timeDiff = endTime - startTime;

      let iStartTime = startTime;
      if (startTime % timeInterval) {
        iStartTime = timeInterval * Math.ceil(startTime / timeInterval);
        if (timeInterval >= PLOT.DAY_IN_MILLIS) {
          const date = new Date(iStartTime);
          date.setHours(0, 0, 0, 0);
          iStartTime = date.getTime();
        }
      }
      ctx.save();
      ctx.fillStyle = getThemeData('bg_font_color');
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
      if (topTick.status) {
        ctx.save();
        ctx.textBaseline = 'bottom';
        ctx.strokeStyle = getThemeData('border_color_1');
        ctx.fillStyle = getThemeData('bg_info_color');
        ctx.setLineDash([3, 2]);
        let i = topTick.sTime;
        const yMargin = yInner ? 4 : 0;
        for (; i < endTime; i += topTick.interval) {
          const tickX = Math.round(chartAttr.x + (chartAttr.w * (i - startTime)) / timeDiff) + 0.5;
          ctx.beginPath();
          ctx.moveTo(tickX, chartAttr.y - yMargin);
          ctx.lineTo(tickX, heightY);
          ctx.stroke();

          ctx.fillText(topTick.format(i), tickX, chartAttr.y - yMargin);
        }
        ctx.restore();
      }
      for (let i = iStartTime; i <= endTime; i += timeInterval) {
        const tickX = Math.round(chartAttr.x + (chartAttr.w * (i - startTime)) / timeDiff) + 0.5;

        if (xAxis.tick.display) {
          ctx.strokeStyle = getThemeData('bg_normal_color');
          ctx.beginPath();
          ctx.moveTo(tickX, heightY);
          ctx.lineTo(tickX, heightY + 4);
          ctx.stroke();

          ctx.fillText(xTickAttr.format(i), tickX, tickY);
        }

        if (xAxis.plotLine.display) {
          ctx.strokeStyle = getThemeData('border_guide_color');
          ctx.setLineDash([2, 1]);
          ctx.beginPath();
          ctx.moveTo(tickX, chartAttr.y);
          ctx.lineTo(tickX, heightY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (xAxis.axisLine.display) {
        ctx.beginPath();
        ctx.strokeStyle = getThemeData('bg_normal_color');
        ctx.moveTo(x, heightY);
        ctx.lineTo(widthX, heightY);
        ctx.stroke();
      }

      ctx.restore();
    };

    public setIntervalAndFormat = () => {
      const { chartAttr, startTime, endTime, config, ctx } = this;
      const timeDiff = endTime - startTime;
      let { interval, format } = getTimeInterval(startTime, endTime);

      if (config.xAxis.tick.format) {
        this.xTickAttr.format = config.xAxis.tick.format;
      } else {
        this.xTickAttr.format = getFormatFunction(format);
      }

      const textWidth = ctx.measureText(this.xTickAttr.format(Date.now())).width;
      const widthMargin = textWidth + XTICK_MARGIN;
      while (interval < timeDiff) {
        const x1 = chartAttr.w * (interval / timeDiff);
        const x2 = chartAttr.w * ((interval * 2) / timeDiff);
        const diff = x2 - x1;

        if (diff >= widthMargin) {
          break;
        }
        interval *= 2;
      }

      this.xTickAttr.timeInterval = interval;
      this.setTopIntervalAndFormat(timeDiff);
    };

    private setTopIntervalAndFormat = (timeDiff: number) => {
      const { chartAttr, startTime, endTime, config, ctx } = this;
      let { status, interval, format, sTime } = getDayInterval(startTime, endTime);

      const formatFunc = getFormatFunction(format);

      const textWidth = ctx.measureText(formatFunc(sTime)).width;
      const widthMargin = textWidth + XTICK_MARGIN;
      while (interval < timeDiff) {
        const x1 = chartAttr.w * (interval / timeDiff);
        const x2 = chartAttr.w * ((interval * 2) / timeDiff);
        const diff = x2 - x1;

        if (diff >= widthMargin) {
          break;
        }
        interval *= 2;
      }

      this.xTickAttr.topTick = { status, interval, format: formatFunc, sTime };
    };

    public timeToXPos = (time: number) => {
      const { x, w } = this.chartAttr;

      if (time < this.startTime || time > this.endTime) {
        return 0;
      }
      const timeDiff = this.endTime - this.startTime;
      return Math.round(x + w * ((time - this.startTime) / timeDiff)) + 0.5;
    };
  };
