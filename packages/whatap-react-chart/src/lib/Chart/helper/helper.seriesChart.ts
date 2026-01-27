import dayjs from 'dayjs';

import { ConfigAttribute } from '../interfaces/ConfigInterface';
import * as Tooltip from './helper.tooltip';

export const SeriesChartHelper = (Base: any) =>
  class extends Base {
    /**
     *  @description Live Data
     */
    public setLiveTimestamp = () => {
      const config = this.config;

      console.log('setLiveTimestamp ! config ===', config);
    };
  };

export const getSeriesTooltipText = (dots: Array<any>, config: ConfigAttribute, that: any) => {
  const dom = document.createElement('div');
  const fDot = dots[0];
  const time = fDot.time;
  const dotLength = dots.length - 1;
  const yTickAttr = that.yTickAttr;
  const timeFormat = config.tooltip.time.format;
  const valueFormat = config.tooltip.value.format;
  const labelFormat = config.tooltip.label.format;

  let currentTime = 0;

  // const doubleMode = dots.length >= 10;
  // let currentDotLocation = false; // true is right;
  dots.map((dot, idx) => {
    const dotTime = dot.time - (dot.time % 1000);
    if (dotTime !== currentTime) {
      currentTime = dotTime;
      dom.appendChild(
        Tooltip.getNomalGrayText(timeFormat ? timeFormat(dot.time) : dayjs(dot.time).format('YYYY-MM-DD HH:mm:ss')),
      );
      // if(doubleMode){
      // 	currentDotLocation = false;
      // }
    }
    const value = valueFormat ? valueFormat(dot.value, yTickAttr, dot) : dot.value;
    const label = labelFormat ? labelFormat(dot.data.label, yTickAttr, dot) : dot.data.label;

    let childDom = Tooltip.getLabelValueText(label, value, dot.strokeColor);
    if (idx === dotLength) {
      childDom.style.marginBottom = '0px';
    }

    // if(doubleMode) {
    // 	currentDotLocation = !currentDotLocation
    // }else{
    dom.appendChild(childDom);
    // }
  });

  if (config?.common?.stack) {
    const dot = dots[0];
    const value = valueFormat ? valueFormat(dot.stackTotal, yTickAttr, dot) : dot.stackTotal;
    if (value) {
      let stackTotalDom = Tooltip.getTotalValueText(value);
      dom.appendChild(stackTotalDom);
    }
  }
  return dom;
};
