import type { ChartCollection } from '../index';

export interface ChartAttribute {
  x: number;
  y: number;
  w: number;
  h: number;
  rightX: number;
  bottomY: number;
  widthX: number; //width + x;
  heightY: number; // height + y
}

export interface MouseAttribute {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  drag: boolean;
  down: boolean;
}

export interface AreaAttribute {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export type ChartType = keyof typeof ChartCollection;

export type DataBehavior = 'avg' | 'sum' | 'replace';

export interface OffsetProps {
  right: number;
  left: number;
  top: number;
  bottom: number;
}

export interface TickAttribute {
  value: number;
  maxValue: number;
  tickValue: number;
  f: number;
  plots: number;
  powValue: number;
  unitDivider: number;
}
