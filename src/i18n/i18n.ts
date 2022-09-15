import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// config
import { defaultLang } from '../config';
import { en, fr, vn, cn, ar } from './locales'

export const resources = {
  en,
  fr,
  vn,
  cn,
  ar
} as const;

export const NAMESPACE_LIST = [
  'authentication',
  'userAccounts',
  'common'
]

export const availableLanguages = Object.keys(resources)

i18n.use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || defaultLang.value,
    debug: false,
    ns: NAMESPACE_LIST,
    fallbackLng: defaultLang.value,
    interpolation: {
      escapeValue: false, // no needed for react as it escapes by default
    },
});
