import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';

import dayjs from 'dayjs';
// eslint-disable-next-line import/no-relative-packages
import { resources } from '../../public/locales';

import 'dayjs/locale/en-ie';
import 'dayjs/locale/ga';

export * from './hooks';
export { useTranslation, Trans } from 'react-i18next';
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
    backend: {
      loadPath: (lngs, nss) => {
        if (process.env.NODE_ENV !== 'production') {
          return '/locales/{{lng}}/{{ns}}.json';
        }

        const lookupLng = lngs?.[0] as (typeof availableLanguages)[number];
        const lookupNs = nss?.[0] as keyof (typeof resources)[typeof lookupLng];
        // @ts-expect-error
        const originalPath = (resources?.[lookupLng]?.[lookupNs] ??
          '') as string;
        return originalPath;
        // return originalPath.replace('/public', '');
      },
    },
  });

export const dayjsLocaleMapping = {
  en: 'en-ie',
  ga: 'ga',
} as const;

i18n.on('languageChanged', (language: (typeof availableLanguages)[number]) => {
  const locale = dayjsLocaleMapping[language];
  dayjs.locale(locale);
});
