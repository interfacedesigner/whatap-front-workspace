import { ChartAttribute } from '../interfaces/BaseInterface';

export function lineChartDataVerifier(dataset: any) {
  if (!dataset || !dataset.length) {
    return false;
  }
  return true;
}

export default (Base: any) =>
  class extends Base {
    public ctx: CanvasRenderingContext2D;
    public chartAttr: ChartAttribute;

    public drawLinePath = (
      dot: any,
      idx: number,
      reverse: boolean = false,
      options: { disconnectThreshold?: number; closePath?: boolean } = {},
    ) => {
      const { ctx } = this;
      const dotLength = dot.length;
      const { disconnectThreshold, closePath } = options;

      if (dotLength === 1) {
        const data = dot[0];
        const { x, y } = data;
        ctx.lineTo(x + 4, y);
      } else {
        let prevDot = null;
        let prevAbnormal = false; // 이전 데이터가 이상한 데이터
        for (let i = 0; i < dotLength; i++) {
          const data = dot[reverse ? dotLength - (i + 1) : i];
          const { x, y } = data;
          const isAbnormal = isNaN(parseInt(data.value));
          if (prevAbnormal) {
            ctx.lineTo(x, this.chartAttr.heightY);
          }

          if (isAbnormal) {
            // null, undefined 등 이상한 데이터
            if (prevDot) {
              ctx.lineTo(prevDot.x, this.chartAttr.heightY);
            }
            prevAbnormal = true;
            continue;
          }
          if (typeof disconnectThreshold === 'number' && prevDot && disconnectThreshold <= data.time - prevDot.time) {
            if (closePath) {
              ctx.lineTo(prevDot.x, this.chartAttr.heightY);
              ctx.lineTo(x, this.chartAttr.heightY);
              ctx.lineTo(x, y);
            } else {
              ctx.moveTo(x, y);
            }
          }
          ctx.lineTo(x, y);
          prevDot = data;
          prevAbnormal = false;
        }
      }
    };

    public LinePathClose = (dot: any, idx: number) => {
      const { ctx, chartAttr } = this;
      const dotLength = dot.length;
      ctx.lineTo(dot[dotLength - 1].x, chartAttr.heightY);
      ctx.lineTo(dot[0].x, chartAttr.heightY);
      ctx.closePath();
    };
  };

export const getLegendId = function (str: string, legendId: string): string {
  var hash = 0,
    i,
    chr;
  if (str.length === 0) {
    return '';
  }
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return legendId + hash.toString(16);
};

export const setDayDiffObj = (data: any) => {
  data[0].color = '#999999';
  data[1].color = '#1999FF';
};

export const setDayStime = (data: any) => {
  data.map((dataset) => {
    const ds = dataset.data;
    const dsLength = Array.isArray(ds) && ds.length;
    if (dsLength) {
      const lasttime = ds[ds.length - 1][0];
      const date = new Date(lasttime);
      date.setHours(0, 0, 0, 0);
      const dayStime = date.getTime();
      dataset.dayStime = dayStime;
    } else {
      dataset.dayStime = 0;
    }
  });
};

export const tagShape = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  pointHeight: number,
) => {
  if (w < 2 * r) {
    r = w / 2;
  }
  if (h < 2 * r) {
    r = h / 2;
  }
  const startX = x + pointHeight;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(startX, y);
  ctx.arcTo(startX + w, y, startX + w, y + r, r);
  ctx.arcTo(startX + w, y + h, startX + w - r, y + h, r);

  ctx.lineTo(startX, y + h);
  ctx.lineTo(startX - pointHeight, y + h / 2);
  ctx.lineTo(startX, y);

  ctx.closePath();

  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.restore();
  return ctx;
};

export const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
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
