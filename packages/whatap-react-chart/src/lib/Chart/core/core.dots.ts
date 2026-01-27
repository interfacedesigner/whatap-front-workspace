import { ChartAttribute, ChartType } from '../interfaces/BaseInterface';
import mixin from '../util/mixinBuilder';

export const DotCore = (Base: any) =>
  class extends mixin(Base).extend() {
    public chartType: ChartType;
    public dots: Array<any>;
    public chartAttr: ChartAttribute;
    public startTime: number;
    public endTime: number;
    public maxValue: number;

    public makeDots() {
      const chartType = this.chartType;

      switch (chartType) {
        case 'LineChart':
        default:
          this.makeLineChartDots();
          break;
      }
    }
    private checkCardinalArea = (index: number, dataLength: number) => index === 0 || index === dataLength - 1;

    private setDataMaxValueDot = (
      originDataTime: number,
      dotset: {
        x: number;
        oriX: number;
        y: number;
        oriY: number;
        time: any;
        value: any;
        strokeColor: any;
        fillColor: any;
        data: any;
      },
    ) => {
      const findMaxValueFromXAxisRange = this.config.common.findMaxValueFromXAxisRange;

      const maxValueData = findMaxValueFromXAxisRange ? this.xAxisRangeMaxValueData : this.dataMaxValueData;

      const compareBaseTime = findMaxValueFromXAxisRange ? dotset.time : originDataTime;

      if (!maxValueData) {
        return;
      }

      const [mTime, mValue] = maxValueData;
      const isMaxValueDot = mTime === compareBaseTime && dotset.value === mValue;

      if (isMaxValueDot) {
        this.dataMaxValueDot = dotset;
      }
    };

    private makeLineChartDots = () => {
      const { data, chartAttr, startTime, endTime, maxValue, config, theme } = this;
      const isStack = config.common.stack;
      this.dataMaxValueDot = undefined;
      if (isStack) {
        this.makeStackChartDots();
        return;
      }
      const isCardinality = config.common.cardinality;
      const { w, h, heightY } = chartAttr;
      const x = chartAttr.x;
      const y = chartAttr.y;

      this.dots = [];

      const timeDiff = endTime - startTime;
      data?.map((ds: any, idx: number) => {
        const dot = [] as any;
        let strokeColor = ds.theme.color;
        let fillColor = ds.theme.fillColor;

        ds.data.map((d: any, i: number) => {
          const originalTime = d[0];
          let time = d[0];
          const value = d[1];

          if (config.xAxis.dayDiff || config.xAxis.dayDiffMulti) {
            time -= ds.dayStime;
            time += this.chartSub.dayStime;
          }

          const oriX = x + w * ((time - startTime) / timeDiff);
          const oriY = heightY - h * (value / maxValue);
          const xPos = Math.round(oriX) + 0.5;
          const yPos = Math.round(oriY) + 0.5;

          let dotset = {
            x: xPos,
            oriX,
            y: yPos,
            oriY,
            time,
            value,
            strokeColor,
            fillColor,
            data: ds,
          };

          if (ds.maxValue === value) {
            ds.maxValueDot = dotset;
            this.setDataMaxValueDot(originalTime, dotset);
          }
          dot.push(dotset);
        });

        this.dots.push(dot);
      });
    };

    private makeStackChartDots = () => {
      const { chartAttr, startTime, endTime, maxValue } = this;
      const { stackValueMatch, stackTotalMatch, stackTimeArray } = this.chartSub;
      const { w, h, heightY } = chartAttr;
      const x = chartAttr.x;
      const y = chartAttr.y;
      const totalMaxMatch = Object.entries(stackTotalMatch || {}).reduce(
        (maxMatch, [time, value]) => {
          const [maxTime, maxValue] = maxMatch;
          if (!maxTime || value >= maxValue) {
            return [Number(time), value];
          }
          return maxMatch;
        },
        [0, 0],
      );

      this.dots = [];
      this.dataMaxValueDot = null;
      const timeDiff = endTime - startTime;
      const timeLength = stackTimeArray.length;
      const dataLength = this.data?.length || 0;
      for (let idx = 0; idx < dataLength; idx++) {
        const ds = this.data[idx];
        const key = ds.key;
        const dot = [] as any;
        const strokeColor = ds.theme.color;
        const fillColor = ds.theme.fillColor;
        for (let i = 0; i < timeLength; i++) {
          const time = stackTimeArray[i];
          const stackValue = stackValueMatch[time][key];
          const stackTotal = stackTotalMatch[time];
          if (!stackValue) {
            continue;
          }

          const oriX = x + w * ((time - startTime) / timeDiff);
          const oriY = heightY - h * (stackValue.value / maxValue);
          const xPos = Math.round(oriX) + 0.5;
          const yPos = Math.round(oriY) + 0.5;

          const dotset = {
            x: xPos,
            oriX,
            y: yPos,
            oriY,
            time,
            value: stackValue.oriValue,
            stackValue: stackValue.value,
            stackTotal: stackTotal,
            strokeColor,
            fillColor,
            data: ds,
          };

          if (ds.maxValue === stackValue.value) {
            ds.maxValueDot = dotset;
          }
          if (!this.dataMaxValueDot && totalMaxMatch[0] == time) {
            this.dataMaxValueDot = dotset;
          }
          dot.push(dotset);
        }

        this.dots.push(dot);
      }
    };
  };
