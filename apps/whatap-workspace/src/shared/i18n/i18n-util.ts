import en from './en';
import type { Locales, TranslationFunctions, Translations } from './i18n-types';
import ko from './ko';

const localeTranslations: Record<Locales, Translations> = {
  ko: ko as unknown as Translations,
  en: en as unknown as Translations,
};

export const loadedLocales: Record<Locales, Translations> = localeTranslations;

export const loadLocale = (locale: Locales): Translations => {
  return localeTranslations[locale];
};

export const i18nObject = (locale: Locales): TranslationFunctions => {
  return loadedLocales[locale] as unknown as TranslationFunctions;
};

export const loadAllLocales = (): void => {
  // All locales are already loaded synchronously
};
