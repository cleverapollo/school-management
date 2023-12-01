import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  DiscountFilter,
} from '@tyro/api';
import { feeKeys } from './keys';

const discounts = graphql(/* GraphQL */ `
  query fees_discounts($filter: DiscountFilter) {
    fees_discounts(filter: $filter) {
      id
      name
      description
      discountType
      value
      siblingDiscount
    }
  }
`);

const discountsQuery = (filter: DiscountFilter) => ({
  queryKey: feeKeys.discounts(filter),
  queryFn: () => gqlClient.request(discounts, { filter }),
});

export function getDiscounts(filter: DiscountFilter) {
  return queryClient.fetchQuery(discountsQuery(filter));
}

export function useDiscounts(filter: DiscountFilter) {
  return useQuery({
    ...discountsQuery(filter),
    select: ({ fees_discounts }) => fees_discounts,
  });
}

export type ReturnTypeFromUseDiscounts = UseQueryReturnType<
  typeof useDiscounts
>[number];
