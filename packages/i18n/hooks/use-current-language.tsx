import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages, dayjsLocaleMapping } from '../index';

export type AvailableLanguages = (typeof availableLanguages)[number];
type DayjsLocaleValues =
  (typeof dayjsLocaleMapping)[keyof typeof dayjsLocaleMapping];

export function useCurrentLanguage() {
  const { i18n } = useTranslation();
  const languageCode = i18n.language as AvailableLanguages;

  return useMemo(
    () => ({
      languageCode,
      dayjsLocale: dayjsLocaleMapping[languageCode] as DayjsLocaleValues,
    }),
    [languageCode]
  );
}
