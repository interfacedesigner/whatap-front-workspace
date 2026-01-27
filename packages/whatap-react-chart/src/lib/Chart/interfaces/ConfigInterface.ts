import { BarChartDotInterface } from './BarChartInterface';
import { ChartType, DataBehavior, OffsetProps, TickAttribute } from './BaseInterface';

/**
 * Base Configuration Attribute
 */
export interface ConfigAttribute {
  type: ChartType;
  xAxis: XAxisConfig;
  yAxis: YAxisConfig & {
    onChangeMaxYValue?: (yTickAttr: Pick<TickAttribute, 'maxValue' | 'powValue' | 'unitDivider'>) => void;
  };
  tooltip: TooltipConfig;
  common: CommonConfig;
  dot: DotConfig;
  meta?: {
    isDataLoaded: boolean;
  };
}

export interface HitmapConfigAttribute extends ConfigAttribute {
  hitmap: HitmapConfig;
}

export interface LineChartConfigAttribute extends ConfigAttribute {}

export interface HorizontalBarChartConfigAttribute extends ConfigAttribute {}

export interface EqualizerChartConfigAttribute extends ConfigAttribute {
  format: {
    value(value: number, dot: BarChartDotInterface): string;
  };
  xAxis: ConfigAttribute['xAxis'] & {
    tick: ConfigAttribute['xAxis']['tick'] & {
      /** x축과 label text 사이 추가 간격 */
      textMargin?: number;
    };
  };
}

export interface VerticalLineAttribute {
  color: string;
  time: number;
  time2?: number;
  text?: string;
  dashed?: boolean;
  alpha?: number;
}

export interface HorizontalLineAttribute {
  title?: string;
  color: string;
  value: number;
  value2?: number;
}

export interface XAxisConfig {
  maxPlot: number;
  axisLine: LineProps;
  plotLine: LineProps;
  gridLine: LineProps;
  tick: TickProps;
  isFixed: boolean;
  timeDiff: number;
  liveTime: boolean;
  dayDiff: boolean;
  dayDiffMulti: boolean | number;
  verticalLine: Array<VerticalLineAttribute>;
}

export interface YAxisConfig {
  maxPlots: boolean | number;
  maxValue: number;
  minValue: number;
  fixedMax: boolean;
  fixedMin: boolean;
  textPosition: string;
  axisLine: LineProps;
  plotLine: LineProps;
  gridLine: LineProps;
  unitDivider: number;
  integerOnly: boolean;
  tick: TickProps;
  horizontalLine: Array<HorizontalLineAttribute>;
}
export interface TooltipConfig {
  selectAll: boolean;
  range: number;
  time: FormatProps;
  label: FormatProps;
  value: FormatProps;
}
export interface CommonConfig {
  isStatic: boolean;
  maxValueText: boolean;
  disconnectThreshold: number;
  identicalDataBehavior: DataBehavior;
  offset: OffsetProps;
  drawHelper: boolean;
  area: boolean;
  stack: boolean;
  cardinality: boolean;
  plotVerticalLine: boolean;
  plotMaxValue: boolean;
  plotMaxText: boolean;
  animate: boolean;
  postRender: PostRenderProps;
  updateAnimation: boolean;
  onTimeSelect?: Function;
  dragCallback?: Function;
  lineOptions?: any;
  onClick?: Function;
  legend?: string;
  focus?: { stime: number; etime: number };

  /** 최댓값의 검색 범위를 차트의 x축 기준 값과 동일한 데이터 범위 내에서만 찾을지 여부
   *
   * plotMaxValue가 true 인 경우 사용
   *
   * @example
   *
   * 입력 데이터: 10, 11, 12 일
   * 차트 x축 기준 날짜 범위: 12일
   *
   * 옵션이 켜져있다면 최댓값은 12 일 데이터에서만 찾아서 12일 데이터에만 표시한다.
   * 옵션이 꺼져있다면 10,11,12 전체 데이터에서 최댓값을 찾아 해당하는 위치에 표시한다.
   */
  findMaxValueFromXAxisRange?: boolean;
}

export interface HitmapConfig {
  level: HitmapDataProps<number>;
  color: HitmapDataProps<string>;
  isStatic: boolean;
  columnBlockCount: number;
  duration: number;
  endTime: number;
  interval: number;
  errorOnly: boolean;
  autoScale: boolean;
}

export interface HitmapDataProps<T> {
  hit: [T, T, T];
  err: [T, T, T];
}

export interface PostRenderProps {
  startTime: number;
  endTime: number;
}

export interface LineProps {
  display: boolean;
  color: string;
  borderWidth?: number;
  borderColor?: string;
  interval?: number;
}

export interface TickProps {
  display: boolean;
  color: string;
  borderWidth?: number;
  borderColor?: string;
  maxTicks?: number;
  format: (d: number, tickAttr?: TickAttribute) => string;
}

export interface FormatProps {
  [x: string]: any;
  totalName: string;
  format: (d: number, tickAttr?: TickAttribute, dot?: any) => any;
}
interface DotAttribute {
  strokeColor: string;
  fillColor: string;
  r: number;
}
export interface DotConfig {
  display: boolean;
  format: (
    d: number,
    dot: any,
    index: number,
  ) => { fillColor: string; strokeColor: string; r: number; lineWidth: number };
}

export interface DrawTopnAttribute {
  dot: any;
  labelHeight?: number;
  yTickWidth?: number;
  rank?: number;
  invert?: boolean;
}
