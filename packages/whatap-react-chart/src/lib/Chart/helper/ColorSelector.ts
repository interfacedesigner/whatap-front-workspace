import { CoreFunc } from '../../core';
import { defaultPalette, disabledInstanceColor, nonInstanceColor } from '../meta/colorMeta';
import defaultTheme, { type RgbAttr, type ThemeAttrs } from '../meta/defaultThemeMeta';
import ChartObserver from '../util/ChartObserver';

export type ThemeKeys = 'bk' | 'wh' | 'pt';
export type Palette = Record<
  ThemeKeys,
  Array<{
    color: string;
    hex: string;
    rgb: [number, number, number];
    alpha: number;
  }>
>;

class ColorSelector {
  private static instance: ColorSelector;
  private colorList: Record<
    string | number,
    Array<{
      id: number;
      color: string;
      hex: string;
      rgb: [number, number, number];
      alpha: number;
      rgbStr: string;
      list: Array<any>;
      count: number;
    }>
  > = {};
  private keyList: Array<{ key: string | number; id: number }> = [];
  private observer = ChartObserver.getInstance();
  private matchKeyColor: Record<string, string | RgbAttr> = {};
  private keyArray: Array<string | number> = [];
  private theme: ThemeAttrs;
  constructor() {
    const conn = this.observer.connect(this.themeUpdate);
    this.theme = conn.store.theme;

    for (const key in defaultPalette as Palette) {
      const themeKey = key as ThemeKeys;
      if (defaultPalette.hasOwnProperty(themeKey)) {
        let pTheme = defaultPalette[themeKey] as Palette[ThemeKeys];
        this.colorList[themeKey] = [];

        pTheme.forEach((dp, idx) => {
          this.colorList[themeKey].push({
            id: idx,
            color: dp.color,
            hex: dp.hex,
            rgb: dp.rgb,
            alpha: dp.alpha,
            rgbStr: CoreFunc.formatRgb(dp.rgb, dp.alpha),
            list: [],
            count: 0,
          });
        });
      }
    }
  }

  static getInstance() {
    if (!ColorSelector.instance) {
      ColorSelector.instance = new ColorSelector();
    }

    return ColorSelector.instance;
  }

  listAllColors = () => {
    return this.colorList;
  };

  /**
   * @public
   * @description add theme to the color list
   * @params { key: string, theme: object }
   */
  addTheme = (key: string, theme: Palette[ThemeKeys]) => {
    if (!this.colorList[key]) {
      this.colorList[key] = [];

      theme.forEach((tp, idx) => {
        this.colorList[key].push({
          id: idx,
          color: tp.color,
          hex: tp.hex,
          rgb: tp.rgb,
          alpha: tp.alpha,
          rgbStr: CoreFunc.formatRgb(tp.rgb, tp.alpha),
          list: [],
          count: 0,
        });
      });
    }
  };

  /**
   * @function getColorFromId
   * @deprecated 2020.04.03
   */
  getColorFromId = (key: string | number, themeId = 'wh') => {
    if (key === -1) {
      return { rgb: nonInstanceColor.rgb, alpha: nonInstanceColor.alpha };
    }
    if (key === -2) {
      return {
        rgb: disabledInstanceColor.rgb,
        alpha: disabledInstanceColor.alpha,
      };
    }

    const existsKeyset = this.keyList.find((keySet) => {
      return keySet.key === key;
    });

    if (existsKeyset) {
      const id = existsKeyset.id;
      const color = this.colorList[themeId][id];
      return { rgb: color.rgb, alpha: color.alpha };
    } else {
      let currentColor = this.colorList[themeId][0];
      const color = this.colorList[themeId].find((colorP) => {
        return colorP.count < currentColor.count;
      });
      if (color) {
        currentColor = color;
      }

      currentColor.count += 1;
      currentColor.list.push(key);
      this.keyList.push({ key: key, id: currentColor.id });

      return { rgb: currentColor.rgb, alpha: currentColor.alpha };
    }
  };

  getChartColorFromId = (key: string | number) => {
    const { getThemeData, matchKeyColor, keyArray } = this;
    if (key === -1) {
      return getThemeData('chart_1');
    }
    if (key === -2) {
      return getThemeData('bg_disabled_color');
    }
    if (key === 'critical') {
      return getThemeData('bg_critical_color');
    }

    const definitionColor = getThemeData(`chart_${key}`);
    if (definitionColor) {
      return definitionColor;
    }
    if (matchKeyColor[key]) {
      return matchKeyColor[key];
    }

    const keyArrayLength = keyArray.length;
    const value = keyArrayLength % 15;
    const color = getThemeData(`chart_${value + 1}`);
    matchKeyColor[key] = color;
    keyArray.push(key);

    return color;
  };

  themeUpdate = (store: { theme: ThemeAttrs }) => {
    const prevTheme = this.theme;
    if (store.theme !== prevTheme) {
      this.theme = store.theme;
      const keyArray = [...this.keyArray];
      const keyArrayLength = keyArray.length;
      if (keyArrayLength) {
        this.keyArray = [];
        this.matchKeyColor = {};

        for (let i = 0; i < keyArrayLength; i++) {
          this.getChartColorFromId(keyArray[i]);
        }
      }
    }
  };

  getThemeData = (themeValueKey: string): string | RgbAttr => {
    return this.theme[themeValueKey] ? this.theme[themeValueKey] : defaultTheme[themeValueKey];
  };
}

export default ColorSelector;
