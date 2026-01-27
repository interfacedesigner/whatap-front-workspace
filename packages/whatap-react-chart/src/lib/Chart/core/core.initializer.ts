import { cloneDeep, merge } from 'lodash-es';

import { HeapSort } from '../../core';
import ColorSelector from '../helper/ColorSelector';
import Tooltip from '../helper/helper.tooltip';
import { ConfigAttribute } from '../interfaces/ConfigInterface';
import { HitmapDataStore } from '../interfaces/HitmapInterface';
import { colorTheme } from '../meta/themeMeta';
import ChartObserver from '../util/ChartObserver';
import updateConfig from '../util/chartConfigUtils';
import chartOptionSelector from '../util/chartOptionSelector';
import { dataValidation } from '../util/dataValidator';

export const InitializeCore = (Base: any) =>
  class extends Base {
    public data: HitmapDataStore[];
    public config: ConfigAttribute;
    public ctx: CanvasRenderingContext2D;
    public frontCtx: CanvasRenderingContext2D;
    public themeId: string;
    /**
     * Starting Point
     */
    public initCore = (bindId: string, options: ConfigAttribute, type: string, suptype?: string) => {
      this.chartType = type || 'LineChart';
      this.chartSubtype = suptype || '';
      this.init(bindId);
      this.initOptions(options);
      this.initUtils();
    };

    public initCanvasProps = () => {
      const ctx = this.ctx;
      const frontCtx = this.frontCtx;
      frontCtx.font = ctx.font = '12px Roboto';
      frontCtx.fillStyle = ctx.fillStyle = this.themeId === 'bk' ? 'white' : '#757575';
      frontCtx.strokeStyle = ctx.strokeStyle = this.themeId === 'bk' ? 'white' : '#d3d3d3';
    };

    /**
     * Init variables, options, utils
     */
    private init = (bindId: string) => {
      this.chartId = bindId;
      this.canvas = document.getElementById(bindId);
      this.parentDom = this.canvas.parentElement;
      this.baseDom = this.parentDom.parentElement;
      this.frontCanvas = document.getElementById(bindId + '_front');
      this.ctx = this.canvas.getContext('2d');
      this.frontCtx = this.frontCanvas ? this.frontCanvas.getContext('2d') : {};
      this.data = [];
      this.dots = [];
      this.plotPoint = true;
      this.plots = 0;
      this.hoveredPlots = [];
      this.dataMaxValue = 0;
      this.maxValue = 0;
      this.maxValueWidth = 0;
      this.tooltip = new Tooltip();
      this.customChartOptions = {};

      // 옵션별로 차트 전역에 저장해야하는 애매한 값을 저장.
      this.chartSub = {
        stackTimeArray: [],
      };

      /**
       * @description 반드시 ColorSelector.instance 를 Observer.instance 보다 먼저 호출해야함
       * 그래야 스토어 업데이트 큐에 ColorSelector가 가장 먼저 등록되면서
       * Theme변경 => ColorSelector에 저장된 컬러들 변경 => Chart의 Theme 변경 콜백 호출 순서로 호출됨
       */
      this.palette = ColorSelector.getInstance();
      this.observer = ChartObserver.getInstance();

      const conn = this.observer.connect(this.storeUpdate);
      this.store = conn.store;
      this.connectionNum = conn.idx;
      this.mouseAttr = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: 0,
        drag: false,
        down: false,
      };

      this.themePalette = merge({}, colorTheme); // 추후 제거 예정
    };

    private initOptions = (options: ConfigAttribute) => {
      const defaultOptions = cloneDeep(
        chartOptionSelector(this.chartType === 'LineChart' ? this.chartType + 'V2' : this.chartType, this.chartSubtype),
      );
      const nextConfig = updateConfig(defaultOptions, options);
      this.config = nextConfig || defaultOptions;
    };

    private initUtils = () => {
      this.heapSort = new HeapSort();
      this.dataValidation = dataValidation;
    };

    private storeUpdate = (store: any) => {
      const prevStore = this.store;
      this.store = store;

      switch (this.chartType) {
        case 'LineChart':
          if (prevStore.theme !== store.theme) {
            this.setDataTheme(true);
            this.drawChart();
          }
          break;
        case 'HitmapChart':
        case 'EqualizerChart':
        case 'HorizontalBarChart':
          if (prevStore.theme !== store.theme) {
            this.drawChart();
          }
          break;
        default:
      }
    };
  };
