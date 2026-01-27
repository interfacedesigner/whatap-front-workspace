import { merge } from 'lodash-es';

import { ChartType } from '../interfaces/BaseInterface';
import {
  ConfigAttribute,
  HitmapConfig,
  HitmapConfigAttribute,
  LineChartConfigAttribute,
} from '../interfaces/ConfigInterface';

const isObject = (data: any) => {
  if (typeof data === 'object' && !Array.isArray(data)) {
    return true;
  }
  return false;
};

export const OptionCore = (Base: any) =>
  class extends Base {
    public chartType: ChartType;
    public config: ConfigAttribute;
    private option: ConfigAttribute; //use to undateOptions function only

    public applyOption = () => {
      this.option = merge({}, this.config);
    };

    public updateOptions = (newOptions: HitmapConfig, diffCheck: boolean = false) => {
      const config = this.config;
      let update = false;
      const optionHandler = (config: any, option: any, newOption: any) => {
        if (isObject(newOption)) {
          Object.keys(newOption).map((op) => {
            if (isObject(newOption[op])) {
              if (isObject(option[op])) {
                optionHandler(config[op], option[op], newOption[op]);
              } else {
                option[op] = merge({}, newOption[op]);
                config[op] = merge({}, option[op]);
                update = true;
              }
            } else {
              if ((!diffCheck || option[op] !== newOption[op]) && typeof newOption[op] !== undefined) {
                config[op] = option[op] = newOption[op];
                update = true;
              }
            }
          });
        }
      };

      optionHandler(config, this.option, newOptions);

      return update;
    };
  };
