import { Discount, DiscountType } from '@tyro/api';

export function getDiscountName({
  name,
  discountType,
  value,
}: Pick<Discount, 'name' | 'discountType' | 'value'>) {
  return discountType === DiscountType.Percentage
    ? `${name} - ${value}%`
    : `${name} - €${value}`;
}
