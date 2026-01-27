import { calculateHitmapArea } from '../util/hitmapUtils';

/**
 * Rectangle Element
 * @param { class } Base
 */
export const rectangleElement = (Base: any) =>
  class extends Base {
    drawBlock = (color: string, x: number, y: number, w: number, h: number) => {
      const ctx: CanvasRenderingContext2D = this.ctx;

      ctx.save();
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);

      ctx.beginPath();
      ctx.moveTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x + w, y);
      ctx.stroke();

      ctx.restore();
    };

    getArea = (w: number, h: number) => {
      const type: string = this.chartType || 'HitmapChart';

      let width = w;
      let height = h;
      switch (type) {
        case 'HitmapChart':
          return calculateHitmapArea(width, height);
      }
      return {
        width,
        height,
      };
    };
  };
