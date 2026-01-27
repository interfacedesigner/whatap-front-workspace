/**
 * WhaTap HorizontalBarChart
 * All rights reserved to WhaTap Labs 2019
 */
import { AxisCore } from '../core/core.axis';
import { CanvasCore } from '../core/core.canvas';
import { HorizontalBarCore } from '../core/core.chart/core.horizontalBar';
import { ChartAttributeCore } from '../core/core.chartAttribute';
import { ComponentCore } from '../core/core.component';
import { DatasetCore } from '../core/core.dataset';
import { FrontDrawCore } from '../core/core.frontDraw';
import { InitializeCore } from '../core/core.initializer';
import { InteractionCore } from '../core/core.interaction';
import { ThemeCore } from '../core/core.theme';
import { TickCore } from '../core/core.tick';
import { HorizontalBarChartConfigAttribute } from '../interfaces/ConfigInterface';
import updateConfig from '../util/chartConfigUtils';
import mixin from '../util/mixinBuilder';

const MixinBase = function () {};
class HorizontalBarChart extends mixin(MixinBase).extend(
  InitializeCore,
  CanvasCore,
  ThemeCore,
  AxisCore,
  ChartAttributeCore,
  ComponentCore,
  InteractionCore,
  TickCore,
  DatasetCore,
  FrontDrawCore,
  HorizontalBarCore,
) {
  constructor(bindId: string, options: HorizontalBarChartConfigAttribute) {
    super();
    this.initCore(bindId, options, 'HorizontalBarChart');
    this.initCanvasProps();
    this.setCanvasProps();
    this.setChartAttribute();
    this.setupChart();
    this.initInteractionListener();
    this.drawChart();
    this.initEqualizerInterval();
  }

  public setupChart = () => {
    this.horizontalBarSetAreaCountAndSize();
    this.horizontalBarSetChartAttribute();
    this.horizontalBarMakeDots();
    this.horizontalBarSetProgressDotDatas();
  };

  public drawChart = () => {
    this.clearCanvas();
    this.horizontalBarDrawBackground();
    this.drawData();
  };

  public loadData = (dataset: any) => {
    this.horizontalBarSavePrevDots();
    this.loadChartData(dataset);
    this.setupChart();
    this.horizontalBarMakeProgressDots();
    this.drawChart();
  };

  public resizeCanvas = (element: HTMLDivElement) => {
    this.resizeCanvasProps(element);
    this.setupChart();
    this.drawChart();
  };

  public calibrateChartProps = (newOption: HorizontalBarChartConfigAttribute) => {
    const nextConfig = updateConfig(this.config, newOption, true);
    if (nextConfig) {
      this.config = nextConfig;
      this.setupChart();
      this.drawChart();
    }
  };

  public chartWillUnmount = () => {
    if (this.tooltip && this.tooltip.willUnmount) {
      this.tooltip.willUnmount();
    }
    this.removeEqualizerInterval();
    this.observer.disconnect(this.connectionNum);
  };
}

export default HorizontalBarChart;
