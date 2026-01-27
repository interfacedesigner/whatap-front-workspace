import * as options from '../option';

export default function chartOptionSelector(type, subtype) {
  switch (type) {
    case 'BarChart':
      return options.barChartOptions;
    case 'ArcChart':
      return options.arcChartOptions;
    case 'HitmapChart':
      return options.hitmapChartOptions;
    case 'StackChart':
      return options.stackChartOptions;
    case 'HorizontalBarChart':
      return options.horizontalBarChartDefault;
    case 'EqualizerChart':
      return options.equalizerChartDefault;
    case 'LineChartV2':
      if (subtype === 'TopnLineChart') {
        return options.topnLineChartOptions;
      }
      return options.lineChartV2Options;
    case 'ArcEqualizer':
      return options.arcEqualizerOptions;
    default:
      return options.lineChartOptions;
  }
}
