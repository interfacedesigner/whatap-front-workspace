export type BarChartDataStore = {
  key: string;
  data: Array<{
    data: number;
    color?: string;
  }>;
  [key: string]: any;
};

export interface BarChartData {
  percentInMax: number;
  height: number;
  data: number;
  last?: boolean;
  [key: string]: any;
}

export interface BarChartDotInterface {
  data: Array<BarChartData>;
  x1: number;
  x2: number;
  width: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  rowData: any;
  total: number;
  label: string;
  fullLabel?: string;
  cuttingLabel: string;
  isMaxValue?: boolean;
  active?: boolean;
}

export type BarChartDots = Array<BarChartDotInterface>;
