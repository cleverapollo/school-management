import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// config
import { defaultLang } from '../config';

import en from './locales/en';
import fr from './locales/fr';
import vn from './locales/vn';
import cn from './locales/cn';
import ar from './locales/ar';

const resources = {
  en,
  fr,
  vn,
  cn,
  ar
};

export const availableLanguages = Object.keys(resources)

i18n.use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || defaultLang.value,
    debug: false,
    ns: ['translations'],
    fallbackLng: defaultLang.value,
    defaultNS: "translations",
    interpolation: {
      escapeValue: false, // no needed for react as it escapes by default
    },
});
