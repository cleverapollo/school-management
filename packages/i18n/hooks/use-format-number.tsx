import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../index';

type AvailableLanguages = (typeof availableLanguages)[number];

export function useFormatNumber() {
  const { i18n } = useTranslation();
  const currentLanguageCode = i18n.language as AvailableLanguages;

  return useMemo(
    () => ({
      formatCurrency: (
        value: number,
        options?: Intl.NumberFormatOptions & { language?: AvailableLanguages }
      ) => {
        const { language, ...intlOptions } = options ?? {};
        return new Intl.NumberFormat(language ?? currentLanguageCode, {
          style: 'currency',
          currency: 'EUR',
          ...intlOptions,
        }).format(value);
      },
    }),
    [currentLanguageCode]
  );
}
