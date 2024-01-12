import { useMemo } from 'react';
import { useCurrentLanguage, AvailableLanguages } from './use-current-language';

export function useFormatNumber() {
  const { languageCode } = useCurrentLanguage();

  return useMemo(
    () => ({
      formatCurrency: (
        value: number,
        options?: Intl.NumberFormatOptions & { language?: AvailableLanguages }
      ) => {
        const { language, ...intlOptions } = options ?? {};
        return new Intl.NumberFormat(language ?? languageCode, {
          style: 'currency',
          currency: 'EUR',
          ...intlOptions,
        }).format(value);
      },
    }),
    [languageCode]
  );
}

export type ReturnTypeFromUseFormatNumber = ReturnType<typeof useFormatNumber>;
