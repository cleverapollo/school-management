import 'react-i18next';
import en from '../src/i18n/locales/en'
import { resources } from '../src/i18n/i18n';
// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: typeof resources['en'];
  };
};
