import { getBarMargin, getFontMargin, getLabelFont } from '../../helper/helper.horizontalBar';
import { ChartAttribute } from '../../interfaces/BaseInterface';
import mixin from '../../util/mixinBuilder';

const MIN_HEIGHT = 16; // bar 12 + margin 1
const MAX_HEIGHT = 45; // bar 40 + margin 5

export const HorizontalBarCore = (Base: any) =>
  class extends mixin(Base).extend() {
    public ctx: CanvasRenderingContext2D;
    public frontCtx: CanvasRenderingContext2D;
    public chartAttr: ChartAttribute;
    public horizontalBarSetAreaCountAndSize = () => {
      const { data, bcRect } = this;
      const dataLength = data.length || 1;
      const height = bcRect.height || 1;

      let barHeight = Math.floor(height / dataLength);
      let areaCount = 1;
      let columnBarCount = 1;
      if (barHeight > MAX_HEIGHT) {
        barHeight = MAX_HEIGHT;
      }
      if (barHeight < MIN_HEIGHT) {
        barHeight = MIN_HEIGHT;
        columnBarCount = Math.floor(height / barHeight) || 1;
        areaCount = Math.ceil(dataLength / columnBarCount) || 1;
        if (areaCount > dataLength) {
          areaCount = dataLength;
        }
      }

      this.areaCount = areaCount;
      this.columnBarCount = columnBarCount;
      this.barSize = barHeight;
      this.barMargin = getBarMargin(barHeight);
      this.barWidthPad = 4;
      this.barDrawHeight = barHeight - this.barMargin * 2;
      this.labelFont = getLabelFont(barHeight);
      this.fontMargin = getFontMargin(barHeight);
    };
    public horizontalBarSetChartAttribute = () => {
      const { bcRect, barWidthPad, labelFont, fontMargin, areaCount, config, dataMaxValue, ctx, chartAttr } = this;
      const width = bcRect.width || 1;
      ctx.save();
      let areaWidth = Math.floor(width / areaCount);
      if (areaWidth < 40) {
        areaWidth = 40;
      }

      const formatValue = config.yAxis && config.yAxis.format;
      let fontWidth = 0;
      let labelWidth = 0;
      for (var i = 0; i < this.data.length; i++) {
        const datum = this.data[i] || {};
        const total = datum.total;
        const label = datum.label;
        if (typeof total !== 'undefined') {
          ctx.font = labelFont;
          const formattedValue = formatValue ? formatValue(total) : total;
          const totalWidth = ctx.measureText(formattedValue).width + barWidthPad;
          if (totalWidth > fontWidth) {
            fontWidth = totalWidth;
          }
        }
        if (typeof label !== 'undefined') {
          ctx.font = '12px Roboto';
          const width = ctx.measureText(label).width;
          if (width > labelWidth) {
            labelWidth = width;
          }
        }
      }
      if (fontWidth < 14) {
        fontWidth = 14;
      }
      if (labelWidth < 12) {
        labelWidth = 12;
      }
      const x = fontWidth + fontMargin * 2;
      const labelX = labelWidth + fontMargin * 2;
      let w = areaWidth - x;
      // 앞으로 계속 유지보수하게되지 않을 거 같아서... 코드가 더럽지만... 일단 지나가겠습니다..
      if (config.yAxis.mode === 2) {
        w -= labelX;
      }
      if (w < 15) {
        w = 15;
      }
      if (config.yAxis.mode === 2) {
        if (x + w + labelX > areaWidth) {
          areaWidth = x + w + labelX;
        }
      } else {
        if (x + w > areaWidth) {
          areaWidth = x + w;
        }
      }

      if (config.yAxis.mode === 2) {
        chartAttr.rightX = x;
        chartAttr.x = labelX;
      } else {
        chartAttr.x = x;
      }
      chartAttr.w = w;
      chartAttr.widthX = areaWidth;
      chartAttr.heightY = bcRect.height;

      ctx.restore();
    };
    public horizontalBarDrawBackground = () => {
      const { chartAttr, ctx, areaCount, palette } = this;
      const { x, widthX, heightY } = chartAttr;

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = palette.getThemeData('bg_normal_color');
      ctx.lineWidth = 1;
      for (let i = 0; i < areaCount; i++) {
        const xPos = x + widthX * i;
        ctx.moveTo(xPos, 0);
        ctx.lineTo(xPos, heightY);
      }
      ctx.stroke();
      ctx.restore();
    };
    public horizontalBarMakeDots = () => {
      const { chartAttr, dataMaxValue, columnBarCount, barSize, config, palette, areaCount } = this;
      const { x, widthX, heightY, w } = chartAttr;
      this.dots = [];
      const formatValue = config?.yAxis?.format;
      const dataLength = this.data.length;
      const maxWidth = config.common.animate ? w - 5 : w;

      for (let i = 0; i < dataLength; i++) {
        const areaNum = areaCount === 1 ? 0 : Math.floor(i / columnBarCount);
        const rowNum = areaCount === 1 ? i : i % columnBarCount;
        const ds = this.data[i];

        if (ds) {
          const { total, key, data } = ds;
          const xStart = areaNum * widthX;
          const xEnd = xStart + widthX;
          const yStart = barSize * rowNum;
          const yEnd = yStart + barSize;

          const datas = [];
          let lastIdx;
          if (dataMaxValue) {
            const length = data.length;
            let lastWidth = 0;
            let j = 0;
            for (; j < length; j++) {
              const d = data[j];
              const value = d.data;
              const color = d.color;
              let width = 0;
              let x = lastWidth;
              if (value) {
                lastIdx = j;
                width = Math.floor(maxWidth * (value / dataMaxValue)) - 1;
                if (width < 1) {
                  width = 1;
                }
                lastWidth += width + 1;
              }
              datas.push({
                value,
                x,
                width,
                color: color ? color : palette.getThemeData('chart_1'),
              });
            }

            if (typeof lastIdx === 'number') {
              datas[lastIdx].width -= 3;
              if (datas[lastIdx].width < 0) {
                datas[lastIdx].width = 0;
              }
            }
          }

          this.dots.push({
            rowData: ds,
            id: ds.id,
            areaNum,
            rowNum,
            label: formatValue ? formatValue(total) : total,
            title: key,
            lastIdx,
            datas,
            xStart,
            xEnd,
            yStart,
            yEnd,
          });
        }
      }
    };

    private equalizerAnimationSub = () => {
      // 이퀄라이저 끝에 둥 둥 떠다니는 효과
      const sw = this.equalizerUpSwitch;
      this.equalizerPos = parseFloat((this.equalizerPos + (sw ? 0.3 : -0.6)).toFixed(2));
      if (this.equalizerPos >= 3 || this.equalizerPos <= 0) {
        this.equalizerUpSwitch = !sw;
      }

      // 데이터 변경 애니메이션
      if (this.progressDots) {
        this.progress += 0.1;
        if (this.progress >= 1) {
          this.progressDots = undefined;
          this.progress = 0;
        }
      }
    };

    public initEqualizerInterval = () => {
      const config = this.config;
      this.equalizerUpSwitch = true;
      this.equalizerPos = 0;
      this.equalizerInterval = setInterval(() => {
        if (config.common.animate) {
          this.equalizerAnimationSub();
          this.horizontalBarSetProgressDotDatas();
          this.drawChart();
        } else {
          this.progressDots = undefined;
        }
      }, 40);
    };

    public removeEqualizerInterval = () => {
      if (this.equalizerInterval) {
        clearInterval(this.equalizerInterval);
      }
    };

    public horizontalBarSavePrevDots = () => {
      if (this.config.common.animate && this.dots.length) {
        this.prevDots = this.dots;
        this.progress = 0;
      } else {
        this.prevDots = undefined;
      }
    };

    // prevDots와 현재의 dots를 비교하여 변경 효과를 그려줄 dots의 틀을 만듦
    public horizontalBarMakeProgressDots = () => {
      const { chartAttr } = this;
      if (this.prevDots && this.dots) {
        this.progressDots = {};
        const maxWidth = chartAttr.w - 5;
        this.prevDots.forEach((dot: any) => {
          const { id, datas, lastIdx } = dot;
          if (id) {
            const prevPercent = datas.map((dat: any) => dat.width / maxWidth);
            this.progressDots[id] = { lastIdx, prevPercent };
          }
        });
        this.dots.forEach((dot: any) => {
          const { id, datas } = dot;
          if (id && this.progressDots[id]) {
            const progressDot = this.progressDots[id];
            const nextPercent = datas.map((dat: any) => dat.width / maxWidth);
            let lastIdx = progressDot.lastIdx;
            if (typeof dot.lastIdx === 'number') {
              if (typeof progressDot.lastIdx === 'number') {
                if (dot.lastIdx > progressDot.lastIdx) {
                  lastIdx = dot.lastIdx;
                }
              } else {
                lastIdx = dot.lastIdx;
              }
            }

            this.progressDots[id] = { ...progressDot, ...dot, nextPercent, lastIdx };
          }
        });
        this.prevDots = undefined;
      }
      this.horizontalBarSetProgressDotDatas();
    };

    public horizontalBarSetProgressDotDatas = () => {
      const { progressDots, progress, chartAttr } = this;
      if (progressDots) {
        const maxWidth = chartAttr.w - 5;
        const keys = Object.keys(progressDots);
        keys.forEach((key: string) => {
          const dot = progressDots[key];
          const { nextPercent, prevPercent, datas } = dot;

          let xPos = 0;
          if (datas) {
            const nextDats = datas.map((dat: any, idx: number) => {
              const { value, color } = dat;
              let x = xPos;
              const prevWidth = maxWidth * (prevPercent[idx] || 0);
              const nextWidth = maxWidth * (nextPercent[idx] || 0);
              const width = (nextWidth - prevWidth) * progress + prevWidth;
              xPos += width;
              return { value, color, x, width };
            });

            dot.datas = nextDats;
          }
        });
      }
    };
  };
