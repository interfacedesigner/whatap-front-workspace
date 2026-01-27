import baseTheme, { ThemeAttrs } from '@lib/Chart/meta/defaultThemeMeta';
import { createContext } from 'react';

const ThemeContext = createContext<ThemeAttrs>(baseTheme);
export default ThemeContext;
