import { type ReactNode, createContext, useCallback, useContext, useState } from 'react';

import type { Locales, TranslationFunctions } from './i18n-types';
import { i18nObject, loadedLocales } from './i18n-util';

interface I18nContextValue {
  locale: Locales;
  setLocale: (locale: Locales) => void;
  LL: TranslationFunctions;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locales;
}

export function I18nProvider({ children, initialLocale = 'ko' }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locales>(() => {
    const stored = localStorage.getItem('locale') as Locales | null;
    return stored && stored in loadedLocales ? stored : initialLocale;
  });

  const setLocale = useCallback((newLocale: Locales) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  }, []);

  const LL = i18nObject(locale);

  return <I18nContext.Provider value={{ locale, setLocale, LL }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useLocale(): Locales {
  return useI18n().locale;
}
