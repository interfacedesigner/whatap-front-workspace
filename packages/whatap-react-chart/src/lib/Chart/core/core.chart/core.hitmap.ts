import updateConfig from '@lib/Chart/util/chartConfigUtils';

import { HitmapHelper } from '../../helper/helper.hitmap';
import { HitmapConfigAttribute } from '../../interfaces/ConfigInterface';
import { HitmapSelectedArea } from '../../interfaces/HitmapInterface';
import mixin from '../../util/mixinBuilder';

export const HitmapCore = (Base: any) =>
  class extends mixin(Base).extend(HitmapHelper) {
    private config: HitmapConfigAttribute;
    private selectedArea: HitmapSelectedArea;

    public rectSetting = (area: HitmapSelectedArea, drawFunc: Function) => {
      const config = this.config;
      if (config.hitmap.isStatic) {
        this.selectedArea = area;
        drawFunc();
      }
    };

    public loadDataAfter = () => {
      const config = this.config;
      if (config.hitmap.autoScale) {
        const nextConfig = updateConfig(this.config, {
          yAxis: { maxValue: 5000 },
        });
        if (nextConfig) {
          this.config = nextConfig;
        }
        this.hitmapAutoScale();
      }
      if (this.selectedArea) {
        this.hitmapSelectArea();
      }
    };
  };
