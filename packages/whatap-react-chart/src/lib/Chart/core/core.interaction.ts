import { getEqualizerTooltipText, getHorizontalBarTooltipText } from '../helper/helper.equalizerBar';
import { hitDataCorrection } from '../helper/helper.hitmap';
import Tooltip from '../helper/helper.tooltip';
import { getMousePos } from '../helper/mouseEvt';
import { BarChartDotInterface, BarChartDots } from '../interfaces/BarChartInterface';
import { ChartAttribute, ChartType, MouseAttribute } from '../interfaces/BaseInterface';
import { ConfigAttribute } from '../interfaces/ConfigInterface';
import { HitmapSelectedArea } from '../interfaces/HitmapInterface';

export const InteractionCore = (Base: any) =>
  class extends Base {
    private mouseMoveThrottled = false;
    private mouseMoveLastEvent?: any = undefined;
    private canvas: HTMLCanvasElement;
    public prevMouseEvent?: MouseEvent;
    public mouseAttr: MouseAttribute;
    public selectedArea: HitmapSelectedArea | undefined;
    public config: ConfigAttribute;
    public style: CSSStyleDeclaration;
    public tooltip: Tooltip;
    public searchDot?: any;
    public searchId?: any; //selectAll = false일 경우에만 사용
    public selectRedLine?: number; //차트 클릭시 선택된 시간 값 저장
    public chartAttr: ChartAttribute;
    public observer: any;

    public initInteractionListener = () => {
      const chartType: ChartType = this.chartType;

      // this.searchDot;

      const canvas = this.canvas;
      const frontCanvas = this.frontCanvas;

      switch (chartType) {
        case 'HitmapChart':
          canvas.addEventListener('mousedown', this.hitmapMouseDown);
          canvas.addEventListener('touchstart', this.hitmapMouseDown);
          canvas.addEventListener('mouseover', this.hitmapMouseOver);
          break;
        case 'LineChart':
          this.lineChartEventListner();
          break;
        case 'HorizontalBarChart':
          this.parentDom.addEventListener('mouseover', this.equalizerMouseOver);
          this.parentDom.addEventListener('mousemove', this.equalizerMouseMove);
          this.parentDom.addEventListener('mouseout', this.equalizerMouseOut);
          this.parentDom.addEventListener('click', this.equalizerMouseClick);
          break;
        case 'BarChart':
        case 'ArcChart':
        case 'EqualizerChart':
          canvas.addEventListener('mouseover', this.equalizerMouseOver);
          canvas.addEventListener('mousemove', this.equalizerMouseMove);
          canvas.addEventListener('mouseout', this.equalizerMouseOut);
          canvas.addEventListener('click', this.equalizerMouseClick);
          if (this.config.common.scroll) {
            canvas.addEventListener('wheel', (evt) => {
              const y = -evt.deltaY;
              evt.preventDefault();
              if (this.chartSub.scrollY) {
                this.chartSub.scrollY += y;
              } else {
                this.chartSub.scrollY = y;
              }

              if (this.chartSub.scrollY > 0) {
                this.chartSub.scrollY = 0;
              }

              let maxHeight = (this.areaHeight || 0) * ((this.areaCount || 0) + 1) - (this.bcRect.height || 0);
              if (maxHeight < 0) {
                maxHeight = 0;
              }
              if (this.chartSub.scrollY < -maxHeight) {
                this.chartSub.scrollY = -maxHeight;
              }
            });
            canvas.addEventListener('touchstart', (evt) => {
              this.chartSub.pageY = evt.touches[0].pageY;
              this.chartSub.pageX = evt.touches[0].pageX;
            });

            canvas.addEventListener('touchmove', (evt) => {
              if (typeof this.chartSub.pageY === 'undefined') {
                return;
              }
              const y = -(this.chartSub.pageY - evt.touches[0].pageY);
              const x = this.chartSub.pageX - evt.touches[0].pageX;
              this.chartSub.pageY = evt.touches[0].pageY;
              this.chartSub.pageX = evt.touches[0].pageX;
              if (Math.abs(x) > Math.abs(y)) {
                return;
              }
              evt.preventDefault();
              if (this.chartSub.scrollY) {
                this.chartSub.scrollY += y;
              } else {
                this.chartSub.scrollY = y;
              }

              if (this.chartSub.scrollY > 0) {
                this.chartSub.scrollY = 0;
              }

              let maxHeight = (this.areaHeight || 0) * ((this.areaCount || 0) + 1) - (this.bcRect.height || 0);
              if (maxHeight < 0) {
                maxHeight = 0;
              }
              if (this.chartSub.scrollY < -maxHeight) {
                this.chartSub.scrollY = -maxHeight;
              }
            });
          }
          break;
        default:
          try {
            throw new Error('This part has not been implemented');
          } catch (e) {
            console.log('InteractionCore: Non implemented component called');
            console.log(e.message);
          }
      }
    };

    public updateAnimation = (startTime: number, endTime: number) => {
      const stimeDiff = startTime - this.startTime;
      const etimeDiff = endTime - this.endTime;
      const stimeInterval = Math.floor(stimeDiff / 12);
      const etimeInterval = Math.floor(etimeDiff / 12);
      const timeoutFunc = () => {
        let flag = true;
        const nextStime = this.startTime + stimeInterval;
        const nextEtime = this.endTime + etimeInterval;

        if (nextStime >= startTime) {
          this.startTime = startTime;
        } else {
          flag = false;
          this.startTime = nextStime;
        }

        if (nextEtime >= endTime) {
          this.endTime = endTime;
        } else {
          flag = false;
          this.endTime = nextEtime;
        }

        if (!flag) {
          setTimeout(timeoutFunc, 24);
        } else {
          this.deleteData();
        }

        this.clearCanvas();
        this.setupChart();
        this.makeDots();
        this.drawChart();
        if (this.config.xAxis.verticalLine || this.selectRedLine) {
          this.drawFront();
        }
        if (this.prevMouseEvent) {
          this.seriesMouseEvent(this.prevMouseEvent);
        }
      };

      timeoutFunc();
    };

    private equalizerMouseOver = (el: MouseEvent) => {
      this.equalzierMouseEvent(el);
    };

    private equalizerMouseMove = (el: MouseEvent) => {
      this.equalzierMouseEvent(el);
    };

    private equalizerMouseOut = () => {
      const tooltip = this.tooltip;
      this.searchDot = undefined;
      tooltip.tooltipOff();
    };

    private equalizerMouseClick = (el: MouseEvent) => {
      const config = this.config;

      if (this.searchDot && config.common.onClick) {
        config.common.onClick(this.searchDot);
      }
    };

    private equalzierMouseEvent = (el: MouseEvent) => {
      const tooltip = this.tooltip;
      const searchDot = this.equalizerSearchDot(el);
      const config = this.config;

      this.prevMouseEvent = el;

      if (this.searchDot !== searchDot) {
        if (searchDot) {
          if (this.chartType === 'HorizontalBarChart') {
            this.tooltip.changeText(getHorizontalBarTooltipText(searchDot, config));
          } else {
            this.tooltip.changeText(getEqualizerTooltipText(searchDot, config));
          }
          if (!this.tooltip.tooltipStat) {
            this.tooltip.tooltipOn();
          }
        } else {
          this.tooltip.tooltipOff();
        }
      }

      this.searchDot = searchDot;

      if (tooltip.tooltipStat) {
        tooltip.follow(el);
      }
    };

    private equalizerSearchDot = (el: MouseEvent): BarChartDotInterface | undefined => {
      const dots: BarChartDots = this.dots;
      const { mx, my: eventMy } = getMousePos(el, this.overrideClientRect());
      const scrollY = this.chartSub.scrollY || 0;
      const my = eventMy + -scrollY * this.ctx.getTransform().d; // y 축 scroll 값과 y 축 scale 을 곱하여 보정합니다.

      const dotLength = dots.length;
      let searchDot;

      for (let i = 0; i < dotLength; i++) {
        const data = dots[i];
        const startX = data.minX || data.xStart;
        const startY = data.minY || data.yStart;
        const endX = data.maxX || data.xEnd;
        const endY = data.maxY || data.yEnd;

        if (mx >= startX && mx <= endX && my <= endY && my >= startY) {
          searchDot = data;
          break;
        }
      }

      return searchDot;
    };

    private hitmapMouseDown = (el: MouseEvent | TouchEvent) => {
      const config = this.config;
      const mouseAttr = this.mouseAttr;
      const mousePos = getMousePos(el, this.overrideClientRect());

      mouseAttr.x1 = mouseAttr.x2 = mousePos.mx;
      mouseAttr.y1 = mouseAttr.y1 = mousePos.my;
      mouseAttr.down = true;

      document.addEventListener('touchmove', this.hitmapMouseMove, {
        passive: false,
      });
      document.addEventListener('touchend', this.hitmapMouseUp, true);
      document.addEventListener('mousemove', this.hitmapMouseMove, true);
      document.addEventListener('mouseup', this.hitmapMouseUp, true);
    };

    private hitmapMouseOver = (el: MouseEvent) => {
      this.canvas.style.cursor = 'crosshair';
    };

    private hitmapMouseMove = (el: MouseEvent | TouchEvent) => {
      const that = this;
      el.preventDefault();
      el.stopPropagation();
      this.throttlingMouseMove(() => {
        const mouseAttr = this.mouseAttr;
        if (mouseAttr.down) {
          const mousePos = getMousePos(el, this.overrideClientRect());

          mouseAttr.x2 = mousePos.mx;
          mouseAttr.y2 = mousePos.my;
          that.hitmapSelectArea();
          that.drawChart();
        }
      });

      /**
       * `AbstractChart` must be inherited and the designated chart must have `drawChart` function implemented
       */
      // this.drawChart();
    };

    private throttlingMouseMove = (func: any) => {
      const delay = 24;
      const that = this;
      if (that.mouseMoveLastEvent) {
        clearTimeout(that.mouseMoveLastEvent);
      }

      if (!that.mouseMoveThrottled) {
        that.mouseMoveThrottled = true;
        that.mouseMoveLastEvent = undefined;
        func();
        setTimeout(() => {
          that.mouseMoveThrottled = false;
        }, delay);
      } else {
        that.mouseMoveLastEvent = setTimeout(() => {
          func();
        }, delay);
      }
    };

    private hitmapMouseUp = (el: MouseEvent | TouchEvent) => {
      const mouseAttr = this.mouseAttr;
      const mousePos = getMousePos(el, this.overrideClientRect());
      const config = this.config;
      const hitmapOption = config.hitmap;

      mouseAttr.x2 = mousePos.mx;
      mouseAttr.y2 = mousePos.my;
      mouseAttr.down = false;

      if (this.selectedArea) {
        if (
          this.selectedArea.endTime - this.selectedArea.startTime < 4999 ||
          this.selectedArea.maxValue - this.selectedArea.minValue < 125
        ) {
          this.selectedArea = undefined;
          this.drawChart();
        } else if (hitmapOption.onSelect) {
          hitmapOption.onSelect({ ...this.selectedArea });
        }

        if (this.selectedArea && !hitmapOption.isStatic) {
          this.selectedArea = undefined;
          this.drawChart();
        }
      }

      /**
       * If mouse position value meets the minimum range calculation value for x & y coordinates, store the selected area into `selectedArea`.
       * This value will be used to draw the dotted black square on the chart.
       */

      document.removeEventListener('touchmove', this.hitmapMouseMove, {
        passive: false,
      });
      document.removeEventListener('touchend', this.hitmapMouseUp, true);
      document.removeEventListener('mousemove', this.hitmapMouseMove, true);
      document.removeEventListener('mouseup', this.hitmapMouseUp, true);
    };

    public hitmapSelectArea = () => {
      const config = this.config;
      const { x1, x2, y1, y2 } = this.mouseAttr;
      const { x, y, w, h } = this.chartAttr;
      const duration = this.duration;
      const startTime = this.startTime;
      const endTime = this.endTime;
      const yValueMax = config.yAxis.maxValue;

      let xLocation = true;

      const selectedArea: HitmapSelectedArea = {
        startTime: 0,
        endTime: 0,
        minValue: 0,
        maxValue: 0,
      };

      let startX: number;
      let endX: number;
      let startY: number;
      let endY: number;

      if (x1 > x2) {
        startX = x2;
        endX = x1;
        xLocation = false;
      } else {
        startX = x1;
        endX = x2;
      }

      if (y1 < y2) {
        startY = y2;
        endY = y1;
      } else {
        startY = y1;
        endY = y2;
      }

      function getChartInX(xPos: number): number {
        if (xPos < x) {
          return x;
        }
        if (xPos > x + w) {
          return x + w;
        }
        return xPos;
      }

      function getChartInY(yPos: number): number {
        if (yPos < y) {
          return y;
        }
        if (yPos > y + h) {
          return y + h;
        }
        return yPos;
      }

      startX = getChartInX(startX);
      endX = getChartInX(endX);
      startY = getChartInY(startY);
      endY = getChartInY(endY);

      const yInterval = yValueMax / 40;
      selectedArea.startTime = hitDataCorrection(this.interval, Math.floor(startTime + duration * ((startX - x) / w)));
      selectedArea.endTime = hitDataCorrection(this.interval, Math.floor(startTime + duration * ((endX - x) / w)));
      selectedArea.minValue = hitDataCorrection(yInterval, Math.floor(yValueMax - yValueMax * ((startY - y) / h)));
      selectedArea.maxValue = hitDataCorrection(yInterval, Math.floor(yValueMax - yValueMax * ((endY - y) / h)));
      const __whatap__ = window.__whatap__;
      if (__whatap__ && __whatap__.ui_hitmap_drag_limit_pcodes && __whatap__.pcode) {
        const obj = JSON.parse(__whatap__.ui_hitmap_drag_limit_pcodes);
        if (obj && obj[__whatap__.pcode]) {
          const limit = obj[__whatap__.pcode];
          if (selectedArea.endTime - selectedArea.startTime > limit.limit) {
            if (xLocation) {
              selectedArea.endTime = selectedArea.startTime + limit.limit;
            } else {
              selectedArea.startTime = selectedArea.endTime - limit.limit;
            }
          }
        }
      }

      if (selectedArea.maxValue >= yValueMax) {
        selectedArea.maxValue = 99999999;
      }

      this.selectedArea = selectedArea;
    };
  };
