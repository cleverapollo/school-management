import { PhoneNumber } from '@tyro/api';

export const formatPhoneNumber = (
  phoneNumber: Partial<PhoneNumber> | null | undefined
) => {
  const { countryCode, number, areaCode } = phoneNumber || {};

  const numberValue = number || '-';

  if (countryCode) {
    return `(${countryCode}) ${numberValue}`;
  }

  if (areaCode) {
    return `${areaCode} ${numberValue}`;
  }

  return numberValue;
};
