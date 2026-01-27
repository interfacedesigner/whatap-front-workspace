export type DirectionStr = 'up' | 'down';

export const HitmapStr = {
  HIT: 'hit',
  ERR: 'err',
} as const;

export interface HitmapDataset {
  hit: Array<[Timestamp, Array<number>]>;
  err: Array<[Timestamp, Array<number>]>;
}

export interface HitmapSelectedArea {
  startTime: number;
  endTime: number;
  minValue: number;
  maxValue: number;
}

/**
 * Timestamp, Hit Array, Error Array
 */
export type HitmapDataStore = [number, number[], number[]];
