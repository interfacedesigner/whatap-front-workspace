/**
 * WhaTap HitmapChart
 * All rights reserved to WhaTap Labs 2019
 */
import { AttributeCore } from '../core/core.attribute';
import { AxisCore } from '../core/core.axis';
import { CanvasCore } from '../core/core.canvas';
import { HitmapCore } from '../core/core.chart/core.hitmap';
import { ComponentCore } from '../core/core.component';
import { DatasetCore } from '../core/core.dataset';
import { InitializeCore } from '../core/core.initializer';
import { InteractionCore } from '../core/core.interaction';
import { ThemeCore } from '../core/core.theme';
import { TickCore } from '../core/core.tick';
import { HitmapConfigAttribute } from '../interfaces/ConfigInterface';
import { DirectionStr, HitmapSelectedArea } from '../interfaces/HitmapInterface';
import updateConfig from '../util/chartConfigUtils';
import mixin from '../util/mixinBuilder';

const MixinBase = function () {};
class HitmapChart extends mixin(MixinBase).extend(
  InitializeCore,
  CanvasCore,
  ThemeCore,
  AxisCore,
  AttributeCore,
  ComponentCore,
  InteractionCore,
  TickCore,
  DatasetCore,
  HitmapCore,
) {
  constructor(bindId: string, options: HitmapConfigAttribute) {
    super();
    this.initCore(bindId, options, 'HitmapChart');
    this.setTheme();
    this.setupChart();
    this.initInteractionListener();
    this.drawChart();
  }

  public setupChart = () => {
    this.setCanvasProps();
    this.setBackground();
    this.setAttribute();
  };

  public drawChart = () => {
    this.clearCanvas();
    this.drawGridLine();
    this.drawData();
    this.drawTick();
    this.drawAxis();
  };

  public loadData = (dataset: any) => {
    this.loadChartData(dataset);
    this.setBackground();
    this.setAttribute();
    this.loadDataAfter();
    this.drawChart();
  };

  public updateData = (dataset: any) => {
    this.updateChartData(dataset);
    this.setBackground();
    this.setAttribute();
    this.loadDataAfter();
    this.drawChart();
  };

  public resizeCanvas = (element: HTMLDivElement) => {
    this.resizeCanvasProps(element);
    this.setCanvasProps();
    this.setBackground();
    this.setAttribute();
    this.drawChart();
  };

  public changeTheme = (theme: string) => {
    this.setTheme(theme);
    this.setupChart();
    this.drawChart();
  };

  public calibrateChartProps = (newOption: HitmapConfigAttribute) => {
    const nextConfig = updateConfig(this.config, newOption, true);
    if (nextConfig) {
      this.config = nextConfig;
    }
    this.setupChart();
    this.drawChart();
  };

  public setYAxisValue = (direction: DirectionStr) => {
    this.setInitalYAxisValue(this.changeYAxis(direction));
  };

  public setInitalYAxisValue = (maxValue: number) => {
    const nextConfig = updateConfig(this.config, { yAxis: { maxValue } });
    if (nextConfig) {
      this.config = nextConfig;
    }
    this.measureMaxValue();
    this.setupChart();
    this.drawChart();
  };

  public setErrorOnly = (errorOnly: boolean) => {
    const nextConfig = updateConfig(this.config, { hitmap: { errorOnly } });
    if (nextConfig) {
      this.config = nextConfig;
    }
    this.drawChart();
  };

  public setSelectRect = (area: HitmapSelectedArea) => {
    this.rectSetting(area, this.drawChart);
  };
}

export default HitmapChart;
