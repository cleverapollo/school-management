import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import dayjs from 'dayjs';
import 'dayjs/locale/en-ie';
import 'dayjs/locale/ga';

export * from './hooks';
export { useTranslation } from 'react-i18next';
export type { TFunction } from 'i18next';

export const defaultNS = 'common';

export const availableLanguages = ['en', 'ga'] as const;

export default i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    lng: 'en',
    load: 'languageOnly',
    ns: [defaultNS],
    debug: process.env.NODE_ENV !== 'production',
    defaultNS,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // no needed for react as it escapes by default
    },
  });

const dayjsLocaleMapping = {
  en: 'en-ie',
  ga: 'ga',
};

i18n.on('languageChanged', (language: (typeof availableLanguages)[number]) => {
  const locale = dayjsLocaleMapping[language];
  dayjs.locale(locale);
});
