import { Address } from '@tyro/api';
import { Fragment } from 'react';

export function joinAddress(
  address: Partial<Address> | undefined | null,
  options?: {
    emptyValue?: string | JSX.Element;
    separator?: string | JSX.Element;
  }
) {
  const { emptyValue = '-', separator = ', ' } = options ?? {};

  if (!address) {
    return emptyValue;
  }

  const { line1, line2, line3, city, country, postCode } = address;

  const filteredAddress = [line1, line2, line3, city, country, postCode].filter(
    (line) => line
  );

  if (typeof separator === 'string') {
    return filteredAddress.join(separator);
  }

  return filteredAddress.map((value, index) => (
    <Fragment key={index}>
      {index !== 0 && separator}
      {value}
    </Fragment>
  ));
}
