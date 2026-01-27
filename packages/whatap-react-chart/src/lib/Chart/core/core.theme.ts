import { merge } from 'lodash-es';

import { getColorVariation } from '../helper/helper.color';

const AREA_ALPHA = 0.3;
const STACK_ALPHA = 0.5;

export const ThemeCore = (Base: any) =>
  class extends Base {
    public loadTheme = (themeChange: boolean = false) => {};
    public setDataTheme = (themeChange: boolean = false) => {
      const { palette, config } = this;
      const fillOpacity = config.common.fillOpacity || 1;
      if (Array.isArray(this.data)) {
        const dataLength = this.data.length;
        for (let i = 0; i < dataLength; i++) {
          const data = this.data[i];
          if (config.common.cardinality && (!i || i === dataLength - 1)) {
            data.theme = {
              color: 'rgba(68, 170, 170, 0.3)',
              fillColor: 'rgba(68, 170, 170, 0.3)',
              stackColor: 'rgba(68, 170, 170, 0.5)',
            };
            continue;
          }

          if (config.xAxis.dayDiff) {
            let color;
            let areaColor;
            let fillColor;
            let stackColor;
            if (i) {
              color = palette.getThemeData('chart_1');
              areaColor = getColorVariation(color, {
                ...palette.getThemeData('endColor'),
                a: AREA_ALPHA,
              });
              stackColor = getColorVariation(color, {
                ...palette.getThemeData('endColor'),
                a: STACK_ALPHA,
              });
            } else {
              color = palette.getThemeData('bg_sub_data_border');
              fillColor = palette.getThemeData('bg_sub_data_fill');
            }
            data.theme = { color, areaColor, fillColor, stackColor };
            continue;
          }

          if (themeChange || !data.theme) {
            const color = data.rowData.color || palette.getChartColorFromId(data.id);
            const lineColor = fillOpacity < 1 ? getColorVariation(color, { a: fillOpacity }) : color;
            const fillColor = getColorVariation(color, {
              ...palette.getThemeData(palette.getThemeData('stackColor')),
              a: fillOpacity,
            });
            const areaColor = getColorVariation(color, {
              ...palette.getThemeData('endColor'),
              a: AREA_ALPHA,
            });
            const stackColor = getColorVariation(color, {
              ...palette.getThemeData('endColor'),
              a: STACK_ALPHA,
            });

            data.theme = { color: lineColor, areaColor, fillColor, stackColor };
          }
        }
      }
    };

    /**
     * 이 아래로는 더이상 사용되지 않는 로직
     */
    public addTheme = (theme: any) => {
      /**
       * `key` for the theme is required
       */
      this.themePalette = merge(this.themePalette, theme);
    };

    public setTheme = (theme: string, override: boolean = false) => {
      const themePalette = this.themePalette;

      let selectedTheme = theme;
      if (!theme || !themePalette[theme]) {
        selectedTheme = 'wh';
      }
      this.theme = themePalette[selectedTheme];
      this.themeId = selectedTheme;
    };
  };
