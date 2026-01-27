import ArcChart from './components/ArcChart';
import ArcEqualizerChart from './components/ArcEqualizerChart';
import BarChart from './components/BarChart';
import EqualizerChart from './components/EqualizerChart';
import HitmapChart from './components/HitmapChart';
import HorizontalBarChart from './components/HorizontalBarChart';
import LineChart from './components/LineChart';
import LineChartV2 from './components/LineChartV2';
import StackChart from './components/StackChart';
import TopnLineChart from './components/TopnLineChart';

/**
 * Chart Collection for selecting chart dynamically
 */
let ChartCollection = {
  /** @deprecated */
  LineChart: LineChart,
  LineChartV2: LineChartV2,
  TopnLineChart: TopnLineChart,
  ArcChart: ArcChart,
  BarChart: BarChart,
  HitmapChart: HitmapChart,
  StackChart: StackChart,
  HorizontalBarChart: HorizontalBarChart,
  EqualizerChart: EqualizerChart,
  /** @deprecated */
  ArcEqualizer: ArcEqualizerChart,
};

export { ChartCollection, HitmapChart, LineChart, StackChart, TopnLineChart };
