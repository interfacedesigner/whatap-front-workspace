import { ChartType } from '@lib/Chart/interfaces/BaseInterface';

export const hasFrontRender = (chartType: ChartType): boolean => {
  switch (chartType) {
    case 'LineChartV2':
    case 'TopnLineChart':
    case 'ArcEqualizer':
    case 'HorizontalBarChart':
      return true;
    default:
      return false;
  }
};
