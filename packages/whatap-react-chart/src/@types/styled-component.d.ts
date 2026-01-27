import baseTheme, { ThemeAttrs } from '@lib/Chart/meta/defaultThemeMeta';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeAttrs {
    [key: string]: unknown;
  }
}
