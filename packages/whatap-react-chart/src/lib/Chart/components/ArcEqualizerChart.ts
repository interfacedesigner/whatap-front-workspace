import { CanvasCore } from '../core/core.canvas';
import { ArcEqualizerCore } from '../core/core.chart/core.arkEqualizer';
import { ChartAttributeCore } from '../core/core.chartAttribute';
import { InitializeCore } from '../core/core.initializer';
import { ThemeCore } from '../core/core.theme';
import mixin from '../util/mixinBuilder';

const MixinBase = function () {};
class ArcEqualizer extends mixin(MixinBase).extend(
  InitializeCore,
  CanvasCore,
  ThemeCore,
  ChartAttributeCore,
  ArcEqualizerCore,
) {
  constructor(bindId: string, options: any) {
    super();
    this.initCore(bindId, options, 'ArcEqualizer');
    this.initCanvasProps();
    this.setTheme();
    this.setCanvasProps();
    this.setChartAttribute();
    this.setupChart();
    this.drawChart();
    this.initAnimationInterval();
  }

  private setupChart = () => {
    this.setChartAttributeY();
    this.setChartAttributeX();
    this.setEqualizerItem();
  };

  public drawChart = () => {
    this.clearCanvas();
    this.drawCanvas();
  };

  public loadData = () => {};
}

export default ArcEqualizer;
