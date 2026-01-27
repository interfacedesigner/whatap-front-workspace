import { cloneDeep } from 'lodash-es';

import TEN_MIM_MOCK from './mock/10m.json';

export type HitmapResData = Array<[Timestamp, Array<number>, Array<number> | undefined]>;

const getHitmapData = (range: 'TEN_MIN' = 'TEN_MIN'): HitmapResData => {
  let data = TEN_MIM_MOCK as HitmapResData;

  return cloneDeep(data);
};
export default getHitmapData;
