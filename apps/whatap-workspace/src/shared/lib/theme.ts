import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'system';

const THEME_KEY = 'opsgent-theme';

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return (localStorage.getItem(THEME_KEY) as Theme) ?? 'light';
}

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemPreference();
  }
  return theme;
}

function applyTheme(theme: Theme) {
  const resolved = resolveTheme(theme);
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

const themeAtom = atom<Theme>(getStoredTheme());

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  // Apply theme class to <html> and persist to localStorage
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Listen for system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  return {
    theme,
    setTheme,
    resolvedTheme: resolveTheme(theme),
    isDark: resolveTheme(theme) === 'dark',
  } as const;
}

/**
 * Initialize theme on app startup (prevents FOUC).
 * Call once in App.tsx or main.tsx.
 */
export function initializeTheme() {
  applyTheme(getStoredTheme());
}
