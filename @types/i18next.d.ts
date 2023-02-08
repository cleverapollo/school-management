import { defaultNS } from '@tyro/i18n';
import { en } from '../public/locales';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof en;
  }
}
