import { ChartAttribute } from '../interfaces/BaseInterface';
import { getScreenRatio } from '../util/displayModulator';

export const CanvasCore = (Base: any) =>
  class extends Base {
    public canvas: HTMLCanvasElement;
    public frontCanvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public frontCtx: CanvasRenderingContext2D;
    public chartAttr: ChartAttribute;
    public width: number;
    public height: number;
    public bcRect: ClientRect;

    public setCanvasProps = () => {
      const canvas: HTMLCanvasElement = this.canvas;
      const ctx: CanvasRenderingContext2D = this.ctx;
      const frontCanvas: HTMLCanvasElement = this.frontCanvas;
      const frontCtx: CanvasRenderingContext2D = this.frontCtx;
      const { font, fillStyle, strokeStyle } = ctx;

      this.wGetBoundingClientRect();
      this.ratio = getScreenRatio(window.devicePixelRatio);
      this.width = this.bcRect.width;
      this.height = this.bcRect.height;

      this.setDpiSupport(this.canvas, this.ctx);

      if (frontCanvas) {
        this.setDpiSupport(this.frontCanvas, this.frontCtx);
        frontCtx.clearRect(0, 0, this.width, this.height);
        frontCtx.font = font;
        frontCtx.fillStyle = fillStyle;
        frontCtx.strokeStyle = strokeStyle;
      }

      /**
       * this.drawPreBackground() omitted. Further use is unknown.
       */

      ctx.clearRect(0, 0, this.width, this.height);

      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;
    };

    /**
     * Get screen size & ratio
     */
    public wGetBoundingClientRect = () => {
      if (this.bcRect === null || typeof this.bcRect === 'undefined') {
        this.bcRect = this.overrideClientRect();
      }
    };

    public overrideClientRect = () => {
      if (this.canvas.parentElement) {
        return this.canvas.parentElement.getBoundingClientRect();
      } else {
        return this.canvas.getBoundingClientRect();
      }
    };

    public resizeCanvasProps = (element: HTMLElement, fixedHeight: number) => {
      const ctx: CanvasRenderingContext2D = this.ctx;
      const frontCtx: CanvasRenderingContext2D = this.frontCtx;
      const { font, fillStyle, strokeStyle } = ctx;

      this.width = element.clientWidth;
      this.height = element.clientHeight;

      this.ratio = getScreenRatio(window.devicePixelRatio);
      this.setDpiSupport(this.canvas, this.ctx);

      if (this.frontCanvas) {
        this.setDpiSupport(this.frontCanvas, this.frontCtx);
        frontCtx.font = font;
        frontCtx.fillStyle = fillStyle;
        frontCtx.strokeStyle = strokeStyle;
      }

      this.overrideClientRect();

      ctx.font = font;
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = strokeStyle;
    };

    public clearCanvas = () => {
      this.ctx.clearRect(0, 0, this.width, this.height);
    };

    public clearFrontCanvas = () => {
      this.frontCtx.clearRect(0, 0, this.width, this.height);
    };

    public clipArea = () => {
      const ctx: CanvasRenderingContext2D = this.ctx;
      const { x, y, w, h } = this.chartAttr;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
    };

    public unclipArea = () => {
      const ctx: CanvasRenderingContext2D = this.ctx;
      ctx.restore();
    };

    public destroy = () => {
      delete this.ctx;
      delete this.canvas;
    };

    private setDpiSupport = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;
      canvas.width = Math.round(this.width * this.ratio);
      canvas.height = Math.round(this.height * this.ratio);
      ctx.resetTransform();
      ctx.scale(this.ratio, this.ratio);
    };

    public resizeParentDomSize = (width?: number, height?: number) => {
      const { baseDom, parentDom } = this;
      let resizeCanvas = false;
      if (!baseDom) {
        return;
      }
      if (width) {
        width = Math.ceil(width);
        const widthText = width + 'px';
        const baseWidth = baseDom.clientWidth;
        if (width <= baseWidth) {
          if (parentDom.style.width !== '100%') {
            parentDom.style.width = '100%';
            resizeCanvas = true;
          }
        } else if (widthText !== parentDom.style.width) {
          parentDom.style.width = widthText;
          resizeCanvas = true;
        }
      }

      if (resizeCanvas) {
        this.resizeCanvas(parentDom);
      }
    };
  };
