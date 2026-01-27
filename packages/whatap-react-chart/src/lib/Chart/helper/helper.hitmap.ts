import { HitmapConfigAttribute } from '../interfaces/ConfigInterface';
import { DirectionStr } from '../interfaces/HitmapInterface';
import { FONT_SIZE, FONT_TYPE } from '../meta/globalMeta';
import { PLOT_STANDARD } from '../meta/globalMeta';
import { TimePos, createDefaultTimestamp } from '../util/timeUtils';

function calculatePlots(height: number) {
  return Math.round(height / PLOT_STANDARD);
}

export function hitDataCorrection(interval: number, value: number): number {
  return Math.round(value / interval) * interval;
}

export const HitmapHelper = (Base: any) =>
  class extends Base {
    public yValueMax: number;
    public config: HitmapConfigAttribute;
    public endTime: number;
    public startTime: number;
    public duration: number;
    public interval: number;
    public ctx: CanvasRenderingContext2D;
    public maxValueWidth: number;
    public tickCount: number;

    /**
     * @function yAutoScale
     * @description 히트맵을 패턴을 파악하기 용이한 시간 범위로 설정
     */
    public hitmapAutoScale = () => {
      const config = this.config;
      const data = this.data;
      const yValueMax = config.yAxis.maxValue;
      const columnBlockCount = config.hitmap.columnBlockCount;
      const last = columnBlockCount - 1;
      const topLength = parseInt(columnBlockCount * 0.7);

      if (yValueMax >= 80000) {
        return;
      }

      let width = 0;
      let fillCells = 0;
      let lastFills = 0;
      data.map((datum, idx) => {
        let lineFillCell = 0;
        const hit = this.convertDataToBlocks(datum[1], yValueMax);
        const err = this.convertDataToBlocks(datum[2], yValueMax);

        /**
         * @description 해당 시간에 데이터가 빈 경우 계산 로직에서 해당 라인은 제외
         */
        let emptyLine = true;
        for (let i = 0; i < columnBlockCount; i++) {
          const value = hit[i] + err[i];
          if (value) {
            if (i >= topLength) {
              lineFillCell++;
            }
            if (last === i) {
              lastFills++;
            }
            if (emptyLine) {
              emptyLine = false;
            }
          }
        }

        if (!emptyLine) {
          fillCells += lineFillCell;
          width++;
        }
      });

      const maxCellCount = width * (columnBlockCount - topLength);

      if (lastFills >= width * 0.2 || fillCells >= maxCellCount * 0.2) {
        this.changeYAxis('up');
        this.hitmapAutoScale();
      }
    };

    /**
     * @function getElapsedUnit
     * @description 범위값(5, 10, 20, 40, 80초)과 캔버스 높이값을 받아 트랜잭션의 소요 시간을 표기하는 단위값을 구한다.
     */
    public getElapsedUnit = (value: number, height: number) => {
      let units = height / 20;
      while (units > value) {
        units = height / 20;
      }
      if (units < 1) {
        units = 1;
      }

      const out = value / units;
      if (out > 100) {
        return (out / 100) * 100;
      } else {
        return out;
      }
    };

    public changeYAxis = (direction: DirectionStr) => {
      const config = this.config;
      const yValueMax = config.yAxis.maxValue || 10000;
      if (direction === 'up' && yValueMax < 80000) {
        config.yAxis.maxValue = yValueMax * 2;
      } else if (direction === 'down' && yValueMax > 5000) {
        config.yAxis.maxValue = yValueMax / 2;
      }

      return config.yAxis.maxValue;
      /**
       * This recalculates the maximum yaxis value width.
       * Used for retrieving `chartAttribute`;
       */
      // this.measureMaxValue();

      /**
       * @todo check where to put `draw` function within here.
       * @todo implement cookie save feature;
       */
    };

    public measureMaxValue = () => {
      const ctx = this.ctx;
      const config = this.config;
      const yValueMax = config.yAxis.maxValue;

      ctx.save();
      ctx.font = `${FONT_SIZE}px ${FONT_TYPE}`;
      const maxValue = Math.floor((yValueMax || 1) / 1000);
      this.maxValueWidth = ctx.measureText(Number(maxValue > 10 ? maxValue : 10).toString()).width;
      ctx.restore();
    };

    /**
     * @function getSplitTimeUnit
     * @description 시간 범위값과 캔버스 너비 값을 받아 시간별 표기 단위값 간의 거리를 구한다.
     */
    public getSplitTimeUnit = (value: number, width: number) => {
      let units = width / 15;
      if (units < 1) {
        units = 1;
      }

      const out = value / units;
      if (value <= 0.005) {
        return 0.005;
      } else {
        let timeUnit = Math.round(out / 1000) * 1000;
        timeUnit = Math.round(timeUnit / 10000) * 10000;
        if (timeUnit === 0) {
          return 10000;
        } else {
          return timeUnit;
        }
      }
    };

    /**
     * Sets the timestamp value of Hitmap
     * @todo Define & clarify dataset type
     * @param { any } dataset
     */
    public setHitmapTimestamp = () => {
      const config = this.config;
      const isStatic = config.hitmap.isStatic;
      const postRender = config.common.postRender;
      const data = this.data;
      const dataLength = data.length;

      try {
        const { min: interval } =
          data.length > 0
            ? data.reduce(
                (result, row) => {
                  const current = row[0] || 0;
                  const diff = current ? current - result.prev : result.min;
                  return {
                    prev: current,
                    min: Math.min(result.min, diff),
                  };
                },
                {
                  prev: 0,
                  min: Infinity,
                },
              )
            : config.hitmap.interval;

        const invalidInterval = !interval || interval === Infinity;
        this.interval = invalidInterval ? config.hitmap.interval : interval;
      } catch {
        this.interval = config.hitmap.interval;
      }

      if (postRender) {
        this.startTime = postRender.startTime;
        this.endTime = postRender.endTime;
        this.duration = this.endTime - this.startTime;
      } else if (!isStatic || (!data.length && !this.startTime)) {
        /**
         * @description Live
         */
        this.endTime = createDefaultTimestamp(TimePos.END) + this.interval;
        this.duration = config.hitmap.duration;
        this.startTime = this.endTime - this.duration;
      } else if (isStatic && dataLength) {
        /**
         * @description Static
         */
        this.endTime = data[dataLength - 1][0];
        this.startTime = data[0][0];
        if (this.endTime === this.startTime) {
          this.startTime = this.endTime - this.interval * 120;
        }
        this.endTime += this.interval;
        this.duration = this.endTime - this.startTime;
      }
    };

    public setHitmapTickCount = () => {
      const config = this.config;
      const { h } = this.chartAttr;

      const availableTicks = calculatePlots(h);
      const maxTicks = config.yAxis.tick && config.yAxis.tick.maxTicks ? config.yAxis.tick.maxTicks : availableTicks;

      if (maxTicks > availableTicks) {
        this.tickCount = availableTicks;
      } else {
        this.tickCount = maxTicks;
      }
    };

    public setHitmapBlockSize = () => {
      const { h, w } = this.chartAttr;
      const interval = this.interval;
      const duration = this.duration;
      const config = this.config;
      const columnBlockCount = config.hitmap.columnBlockCount;

      const ratio = this.ratio;
      const minPixel = 1 / ratio;

      this.blockHeight = Math.max(Math.floor(h / columnBlockCount), minPixel);
      this.blockWidth = Math.max(Math.floor(w / (duration / interval)), minPixel);
    };

    public convertDataToBlocks = (hit: number[], max: number) => {
      let h2 = new Array(40);
      for (let i = 0; i < h2.length; i++) {
        h2[i] = 0;
      }
      switch (max) {
        case 120:
          for (let i = 0; i < 120; i++) {
            h2[Math.floor(i / 3)] += hit[i] || 0;
          }
          break;
        case 5000:
          for (let i = 0; i < 40; i++) {
            h2[i] += hit[i] || 0;
          }
          for (let i = 40; i < 120; i++) {
            h2[39] += hit[i] || 0;
          }
          break;
        case 10000:
          for (let i = 0; i < 40; i++) {
            h2[(i / 2) | 0] += hit[i] || 0;
          }
          for (let i = 40; i < 60; i++) {
            h2[i - 20] += hit[i] || 0;
          }
          for (let i = 60; i < 120; i++) {
            h2[39] += hit[i] || 0;
          }
          break;
        case 20000:
          for (let i = 0; i < 40; i++) {
            h2[(i / 4) | 0] += hit[i] || 0;
          }
          for (let i = 40; i < 60; i++) {
            h2[((i - 20) / 2) | 0] += hit[i] || 0;
          }
          for (let i = 60; i < 80; i++) {
            h2[i - 40] += hit[i] || 0;
          }
          for (let i = 80; i < 120; i++) {
            h2[39] += hit[i] || 0;
          }
          break;
        case 40000:
          for (let i = 0; i < 40; i++) {
            h2[(i / 8) | 0] += hit[i] || 0;
          }
          for (let i = 40; i < 60; i++) {
            h2[((i - 20) / 4) | 0] += hit[i] || 0;
          }
          for (let i = 60; i < 80; i++) {
            h2[((i - 40) / 2) | 0] += hit[i] || 0;
          }
          for (let i = 80; i < 100; i++) {
            h2[(i - 60) | 0] += hit[i] || 0;
          }
          for (let i = 100; i < 120; i++) {
            h2[39] += hit[i] || 0;
          }
          break;
        case 80000:
          for (let i = 0; i < 40; i++) {
            h2[(i / 16) | 0] += hit[i] || 0;
          }
          for (let i = 40; i < 60; i++) {
            h2[((i - 20) / 8) | 0] += hit[i] || 0;
          }
          for (let i = 60; i < 80; i++) {
            h2[((i - 40) / 4) | 0] += hit[i] || 0;
          }
          for (let i = 80; i < 100; i++) {
            h2[((i - 60) / 2) | 0] += hit[i] || 0;
          }
          for (let i = 100; i < 120; i++) {
            h2[i - 80] += hit[i] || 0;
          }
          break;
        default:
          for (let i = 0; i < 40; i++) {
            h2[i] = hit[i];
          }
      }
      return h2;
    };
  };
