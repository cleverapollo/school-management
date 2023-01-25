import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';

// eslint-disable-next-line import/no-relative-packages
import { en, ga } from '../../public/locales';

export { useTranslation } from 'react-i18next';
export type { TFunction } from 'i18next';

export const defaultNS = 'common';
export const resources = {
  en,
  ga,
} as const;
export const namespaces = ['authentication', 'common', 'userAccounts'];

export const availableLanguages = Object.keys(
  resources
) as (keyof typeof resources)[];

export default i18n
  .use(LanguageDetector)
  .use(HttpBackend)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    lng: 'en',
    ns: namespaces,
    debug: process.env.NODE_ENV !== 'production',
    defaultNS,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // no needed for react as it escapes by default
    },
  });
