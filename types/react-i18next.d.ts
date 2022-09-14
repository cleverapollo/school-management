import 'react-i18next';
import en from './locales/en.json'

// react-i18next versions higher than 11.11.0
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translations';
    resources: typeof en;
  };
};
