import { ChartAttribute } from '../../interfaces/BaseInterface';
import mixin from '../../util/mixinBuilder';

const TOTAL_ARC_RADIUS = 60;
const PADDING_DOT = 8;
const SPEED_WIDTH = 6;
const TWO_PI = Math.PI * 2;

export const ArcEqualizerCore = (Base: any) =>
  class extends mixin(Base).extend() {
    private intervalId: any;
    private speedDotFI: number;
    public ctx: CanvasRenderingContext2D;
    public chartAttr: ChartAttribute;
    public eqItem: any;

    public setEqualizerItem = () => {
      const { x, y, w, h } = this.chartAttr;
      const item: any = {};
      item.hWidth = w / 2;
      item.hHeight = h / 2;
      item.x = x + item.hWidth;
      item.y = y + item.hHeight;
      item.radius = item.hWidth > item.hHeight ? item.hHeight : item.hWidth;
      this.eqItem = item;
    };

    public initAnimationInterval = () => {
      this.speedDotFI = Math.PI;
      this.intervalId = setInterval(() => {
        this.speedDotFI += Math.PI * 0.01;
        if (this.speedDotFI < TWO_PI) {
          this.speedDotFI -= TWO_PI;
        }
        this.drawSpeedDot();
      }, 24);
    };

    public unmountAnimationInterval = () => {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
    };

    public drawCanvas = () => {
      const ctx = this.ctx;
      const { x, y, radius } = this.eqItem;
      this.drawBg();
      this.drawTotalArc();
    };

    private drawSpeedDot = () => {
      const ctx = this.ctx;
      const speedDotFI = this.speedDotFI;
      const { x, y, radius } = this.eqItem;
      const sRadius = radius + PADDING_DOT;
      const eRadius = sRadius + SPEED_WIDTH;

      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = 'red';
      ctx.arc(x, y, sRadius, speedDotFI, speedDotFI + Math.PI);
      ctx.arc(x, y, eRadius, speedDotFI + Math.PI, speedDotFI, true);
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = 'blue';
      ctx.arc(x, y, sRadius, speedDotFI, speedDotFI + Math.PI, true);
      ctx.arc(x, y, eRadius, speedDotFI + Math.PI, speedDotFI);
      ctx.fill();
    };

    private drawBg = () => {
      const ctx = this.ctx;
      const { x, y, radius } = this.eqItem;
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = '#E3F3FE';
      ctx.strokeStyle = '#BBE1FF';
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    private drawTotalArc = () => {
      const ctx = this.ctx;
      const { x, y } = this.eqItem;
      ctx.save();

      ctx.beginPath();
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#999999';
      ctx.arc(x, y, TOTAL_ARC_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#666666';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = '12px Roboto';
      ctx.fillText('Total TX', x, y - 3);

      ctx.font = 'bold 20px Roboto';
      ctx.fillStyle = '#000000';
      ctx.textBaseline = 'top';
      ctx.fillText('0', x, y + 4);

      ctx.restore();
    };
  };
