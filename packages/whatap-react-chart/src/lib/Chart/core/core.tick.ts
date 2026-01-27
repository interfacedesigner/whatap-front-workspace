import dayjs, { Dayjs } from 'dayjs';

import { ChartAttribute, ChartType } from '../interfaces/BaseInterface';
import { CHART_TICK_OFFSET_Y, CHART_TICK_SPACE, FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import {
  DAY_IN_MILLIS,
  FIVE_MIN_IN_MILLIS,
  FIVE_SEC_IN_MILLIS,
  HOUR_IN_MILLIS,
  HOUR_MINUTE,
  MINUTE_SECOND,
  MIN_IN_MILLIS,
  MONTH_DATE,
  SEVEN_DAY_IN_MILLIS,
  SIX_HOUR_IN_MILLIS,
  THIRTY_MIN_IN_MILLIS,
  THIRTY_SEC_IN_MILLIS,
  THREE_DAY_IN_MILLIS,
  TWELVE_HOUR_IN_MILLIS,
} from '../meta/plotMeta';
import { calculateHitmapArea } from '../util/hitmapUtils';
import { timeToPos } from '../util/positionCalc';

//TickCore는 더이상 사용되지 않습니다. xTick, yTick을 이용해주세요
export const TickCore = (Base: any) =>
  class extends Base {
    public chartType: ChartType;
    public chartAttr: ChartAttribute;
    public ctx: CanvasRenderingContext2D;

    public drawTick = () => {
      const chartType = this.chartType;
      const config = this.config;
      const yTick = config.yAxis.tick.display;
      const xTick = config.xAxis.tick.display;

      switch (chartType) {
        case 'HitmapChart':
          if (xTick) {
            this.drawXtimeTick();
          }
          if (yTick) {
            this.drawYhitmapTick();
          }
        case 'LineChart':
          if (xTick) {
            this.drawXtimeTick();
          }
          if (yTick) {
            this.drawYlineTick();
          }

        default:
          break;
      }
    };

    private drawXtimeTick = () => {
      const ctx = this.ctx;
      const startTime = this.startTime;
      const endTime = this.endTime;
      const duration = this.duration;
      const { x, y, w, h } = this.chartAttr;
      const theme = this.theme;

      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
      ctx.fillStyle = this.palette.getThemeData('bg_font_color');

      let minUnit = FIVE_SEC_IN_MILLIS;
      let format = MINUTE_SECOND;
      let mTickTime: Dayjs;
      if (duration >= SEVEN_DAY_IN_MILLIS) {
        minUnit = DAY_IN_MILLIS;
        format = MONTH_DATE;
        mTickTime = this.getNearStartTime(startTime, 'date', 1);
      } else if (duration >= THREE_DAY_IN_MILLIS) {
        minUnit = SIX_HOUR_IN_MILLIS;
        format = HOUR_MINUTE;
        mTickTime = this.getNearStartTime(startTime, 'hour', 6);
      } else if (duration >= TWELVE_HOUR_IN_MILLIS) {
        minUnit = HOUR_IN_MILLIS;
        format = HOUR_MINUTE;
        mTickTime = this.getNearStartTime(startTime, 'hour', 1);
      } else if (duration >= SIX_HOUR_IN_MILLIS) {
        minUnit = THIRTY_MIN_IN_MILLIS;
        format = HOUR_MINUTE;
        mTickTime = this.getNearStartTime(startTime, 'minute', 30);
      } else if (duration >= HOUR_IN_MILLIS) {
        minUnit = FIVE_MIN_IN_MILLIS;
        format = HOUR_MINUTE;
        mTickTime = this.getNearStartTime(startTime, 'minute', 5);
      } else if (duration > MIN_IN_MILLIS) {
        minUnit = MIN_IN_MILLIS;
        format = HOUR_MINUTE;
        mTickTime = this.getNearStartTime(startTime, 'minute', 1);
      } else {
        mTickTime = this.getNearStartTime(startTime, 'second', 5);
      }

      const textWidth = ctx.measureText(mTickTime.format(format)).width;
      this.minUnit;
      minUnit = this.getInterval(mTickTime, minUnit, textWidth);
      let thisTime = mTickTime.toDate().getTime();
      /**
       * 그리드 라인을 그리는 시작점을 Tick 과 맞추기 위한 코드
       * 해당 차트 장기 유지보수 하지 않고 신규 환경으로 옮길 예정이기 때문에 그냥 쉽게 해결하기 위해 추가
       */
      this.hitmapXStartTime = thisTime;
      if (thisTime < startTime) {
        thisTime += minUnit;
      }

      const textY = y + h + FONT_SIZE + CHART_TICK_OFFSET_Y;
      while (thisTime <= endTime) {
        const xPos = x + (w * (thisTime - startTime)) / (endTime - startTime);
        const timeValue = dayjs(thisTime).format(format);

        ctx.beginPath();
        ctx.strokeStyle = this.palette.getThemeData('bg_normal_color');
        ctx.moveTo(xPos, textY - FONT_SIZE);
        ctx.lineTo(xPos, y + h);
        ctx.stroke();
        ctx.fillText(timeValue, xPos, textY);

        thisTime += minUnit;
      }

      ctx.restore();
    };

    private drawYhitmapTick = () => {
      const ctx = this.ctx;
      const theme = this.theme;
      const config = this.config;
      const yValueMax = config.yAxis.maxValue;
      let tickValue = yValueMax;
      let tickCount = this.getIntValueTickCount(tickValue, this.tickCount);
      const yAxisFormat = config.yAxis.tick.format;
      const { x, y, w, h } = this.chartAttr;
      const heightInterval = h / tickCount;

      ctx.save();

      ctx.textAlign = 'right';
      ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
      ctx.fillStyle = this.palette.getThemeData('bg_font_color');

      for (let i = 0; i <= tickCount; i++) {
        const textX = x - CHART_TICK_SPACE;
        const textY = y + i * heightInterval;

        const value = yAxisFormat(tickValue);
        ctx.fillText(value, textX, textY);
        tickValue -= yValueMax / tickCount;
      }

      ctx.restore();
    };

    private drawYlineTick = () => {
      /** @todo draw line y tick */
    };

    private getNearStartTime = (
      startTime: number,
      unit: 'second' | 'minute' | 'hour' | 'date',
      timeRange: number,
    ): Dayjs => {
      let mStartTime = dayjs(startTime);
      const time = mStartTime[unit]();
      const remainder = time % timeRange;

      if (remainder !== 0) {
        mStartTime[unit](time - remainder + timeRange);
      }

      switch (unit) {
        case 'date':
          mStartTime = mStartTime.hour(0);
        case 'hour':
          mStartTime = mStartTime.minute(0);
        case 'minute':
          mStartTime = mStartTime.second(0);
        case 'second':
          mStartTime = mStartTime.millisecond(0);
      }

      if (mStartTime.toDate().getTime() < startTime) {
        mStartTime[unit](mStartTime[unit]() + 1);
      }

      return mStartTime;
    };

    private getInterval = (tickStartTime: Dayjs, timeRange: number, textWidth: number): number => {
      const { w } = this.chartAttr;
      const startTime = this.startTime;
      const endTime = this.endTime;
      const tickTime = tickStartTime.toDate().getTime();

      let interval = 1;
      let range = timeRange;

      const textMargin = textWidth * 1.3;
      let secondTime = tickTime + range;
      while (secondTime <= endTime) {
        const firstTick = (w * (tickTime - startTime)) / (endTime - startTime);
        const secondTick = (w * (secondTime - startTime)) / (endTime - startTime);
        if (secondTick - firstTick < textMargin) {
          range = timeRange * ++interval;
          secondTime = tickTime + range;
          continue;
        }
        break;
      }

      return range;
    };

    private getIntValueTickCount = (maxValue: number, tickCount: number) => {
      while (maxValue / 1000 >= 1) {
        maxValue = maxValue / 1000;
      }

      while (tickCount > 1 && maxValue % tickCount) {
        tickCount--;
      }

      return tickCount;
    };
  };
