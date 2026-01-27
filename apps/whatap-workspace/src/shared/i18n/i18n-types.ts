import type { LocalizedString } from 'typesafe-i18n';

export type Locales = 'ko' | 'en';

export type BaseTranslation = {
  common: {
    confirm: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    loading: string;
    error: string;
  };
  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    loginFailed: string;
    loggingIn: string;
  };
  nav: {
    home: string;
    dashboard: string;
    settings: string;
  };
};

export type Translation = BaseTranslation;

export type Translations = {
  common: {
    confirm: LocalizedString;
    cancel: LocalizedString;
    save: LocalizedString;
    delete: LocalizedString;
    edit: LocalizedString;
    loading: LocalizedString;
    error: LocalizedString;
  };
  auth: {
    login: LocalizedString;
    logout: LocalizedString;
    email: LocalizedString;
    password: LocalizedString;
    loginFailed: LocalizedString;
    loggingIn: LocalizedString;
  };
  nav: {
    home: LocalizedString;
    dashboard: LocalizedString;
    settings: LocalizedString;
  };
};

export type TranslationFunctions = Translations;
