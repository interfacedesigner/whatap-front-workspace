import type { ThemeAttrs } from '@lib/Chart/meta/defaultThemeMeta';
import baseTheme from '@lib/Chart/meta/defaultThemeMeta';
import ThemeContext from '@react/context/ThemeContext';
import React, { useContext } from 'react';
import { ThemeProvider as StyledThemePvodier } from 'styled-components';

interface StyledComponentThemePvodierProps {
  children: React.ReactNode;
}

const StyledComponentThemePvodier: React.FC<StyledComponentThemePvodierProps> = ({ children }) => {
  const value = useContext(ThemeContext);
  return <StyledThemePvodier theme={value}>{children}</StyledThemePvodier>;
};

interface ThemeProviderProps {
  value?: ThemeAttrs;
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ value, children }) => {
  return (
    <ThemeContext.Provider value={value || baseTheme}>
      <StyledComponentThemePvodier>{children}</StyledComponentThemePvodier>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
