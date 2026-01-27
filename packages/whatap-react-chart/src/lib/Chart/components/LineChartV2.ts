/**
 * WhaTap LineChartV2
 * All rights reserved to WhaTap Labs 2019
 */
import { CanvasCore } from '../core/core.canvas';
import { SeriesCore } from '../core/core.chart/core.series';
import { ChartAttributeCore } from '../core/core.chartAttribute';
import { ComponentCore } from '../core/core.component';
import { DatasetCore } from '../core/core.dataset';
import { DotCore } from '../core/core.dots';
import { FrontDrawCore } from '../core/core.frontDraw';
import { InitializeCore } from '../core/core.initializer';
import { InteractionCore } from '../core/core.interaction';
import { ThemeCore } from '../core/core.theme';
import { XTickCore } from '../core/core.xTick';
import { YTickCore } from '../core/core.yTick';
import { LineChartConfigAttribute } from '../interfaces/ConfigInterface';
import updateConfig from '../util/chartConfigUtils';
import mixin from '../util/mixinBuilder';

const MixinBase = function () {};
class LineChartV2 extends mixin(MixinBase).extend(
  InitializeCore,
  CanvasCore,
  ThemeCore,
  ChartAttributeCore,
  XTickCore,
  YTickCore,
  ComponentCore,
  InteractionCore,
  DatasetCore,
  DotCore,
  FrontDrawCore,
  SeriesCore,
) {
  constructor(bindId: string, options: LineChartConfigAttribute) {
    super();
    this.initCore(bindId, options, 'LineChart');
    this.initCanvasProps();
    this.setCanvasProps();
    this.setChartAttribute();
    this.initSetupChart();
    this.drawChart();
    this.drawFront();
    this.initInteractionListener();
    // this.setLiveTimeInterval();
  }

  private initSetupChart = () => {
    this.setDefaultTimezone();
    this.setChartAttributeY();
    this.setPlotsAndMaxValue();
    this.setChartAttributeX();
  };

  private setupChart = () => {
    //차트의 데이터를 그리기 이전, 데이터를 그릴 영역 지정 등 차트에 필요한 세팅을 하는 부분
    this.setChartAttributeY();
    this.setMaxValueAndWidth();
    this.setChartAttributeX();
    this.setIntervalAndFormat();
  };

  public drawChart = () => {
    this.clearCanvas();
    this.drawYTick();
    this.drawXTick();
    this.drawData();
    this.drawPostYTick();
  };

  public drawFront = () => {
    this.clearFrontCanvas();
    this.drawFrontData();
  };

  public loadData = (dataset: any) => {
    this.loadChartData(dataset);
    this.setupChart();
    this.makeDots();
    this.drawChart();
    this.drawFront();
  };

  public updateData = (dataset: any) => {
    this.updateChartData(dataset);
    this.setupChart();
    this.makeDots();
    this.drawChart();
    this.drawFront();
  };

  public resizeCanvas = (element: HTMLDivElement) => {
    this.resizeCanvasProps(element);
    this.setChartAttributeY();
    this.setPlotsAndMaxValue();
    this.setChartAttributeX();
    this.setIntervalAndFormat();
    this.makeDots();
    this.drawChart();
    this.drawFront();
  };

  public calibrateChartProps = (newOption: LineChartConfigAttribute) => {
    const nextConfig = updateConfig(this.config, newOption);
    if (nextConfig) {
      this.config = nextConfig;
    }
    this.settingTime();
    this.setupChart();
    this.makeDots();
    this.drawChart();
    this.drawFront();
  };

  public setCustomChartOptions = (newOption: any) => {
    this.prevCustomChartOptions = this.customChartOptions;
    this.customChartOptions = newOption || {};
    this.updateCustomChartOptions();
  };

  public chartWillUnmount = () => {
    if (this.tooltip && this.tooltip.willUnmount) {
      this.tooltip.willUnmount();
    }
    this.removeLiveTimeInterval();
    this.observer.unsubscribeAll(this);
    this.observer.disconnect(this.connectionNum);
  };
}

export default LineChartV2;
