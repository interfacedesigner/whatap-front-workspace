/**
 * WhaTap EqualizerChart
 * All rights reserved to WhaTap Labs 2019
 */
import { AttributeCore } from '../core/core.attribute';
import { AxisCore } from '../core/core.axis';
import { CanvasCore } from '../core/core.canvas';
import { EqualizerCore } from '../core/core.chart/core.equalizer';
import { ComponentCore } from '../core/core.component';
import { DatasetCore } from '../core/core.dataset';
import { InitializeCore } from '../core/core.initializer';
import { InteractionCore } from '../core/core.interaction';
import { ThemeCore } from '../core/core.theme';
import { TickCore } from '../core/core.tick';
import { EqualizerChartConfigAttribute } from '../interfaces/ConfigInterface';
import updateConfig from '../util/chartConfigUtils';
import mixin from '../util/mixinBuilder';

const MixinBase = function () {};
class EqualizerChart extends mixin(MixinBase).extend(
  InitializeCore,
  CanvasCore,
  ThemeCore,
  AxisCore,
  AttributeCore,
  ComponentCore,
  InteractionCore,
  TickCore,
  DatasetCore,
  EqualizerCore,
) {
  constructor(bindId: string, options: EqualizerChartConfigAttribute) {
    super();
    this.initCore(bindId, options, 'EqualizerChart');
    this.initEqualizerInterval(this.drawChart);

    this.setTheme();
    this.setupChart();
    this.initInteractionListener();
    this.drawChart();
  }

  public setupChart = () => {
    this.setCanvasProps();
    this.setAttribute();
    this.setBackground();
    this.setEqualizerSizeAttr();
    this.equalizerInteractionTrigger();
  };

  public drawChart = () => {
    this.clearCanvas();
    this.drawData();
  };

  public loadData = (dataset: any) => {
    this.loadChartData(dataset);
    this.setAttribute();
    this.setBackground();
    this.setEqualizerSizeAttr();
    this.equalizerInteractionTrigger();
    this.drawChart();
  };

  public resizeCanvas = (element: HTMLDivElement) => {
    this.resizeCanvasProps(element);
    this.setCanvasProps();
    this.setBackground();
    this.setEqualizerSizeAttr();
    this.drawChart();
  };

  public changeTheme = (theme: string) => {
    this.setTheme(theme);
    this.setupChart();
    this.drawChart();
  };

  public calibrateChartProps = (newOption: EqualizerChartConfigAttribute) => {
    const nextConfig = updateConfig(this.config, newOption);
    if (nextConfig) {
      this.config = nextConfig;
    }
    this.setupChart();
    this.drawChart();
  };

  public chartWillUnmount = () => {
    if (this.tooltip && this.tooltip.willUnmount) {
      this.tooltip.willUnmount();
    }
    this.removeEqualizerInterval();
    this.observer.disconnect(this.connectionNum);
  };
}

export default EqualizerChart;
