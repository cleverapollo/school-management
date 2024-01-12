import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  FeeFilter,
} from '@tyro/api';
import { feeKeys } from './keys';

const feeDebtors = graphql(/* GraphQL */ `
  query fees_payments($filter: FeeFilter) {
    fees_fees(filter: $filter) {
      debtors {
        id
        feeId
        person {
          partyId
          firstName
          lastName
          avatarUrl
          type
        }
        classGroup {
          name
        }
        feeStatus
        amount
        amountPaid
        amountDue
        amountDiscounted
        discounts {
          id
          name
          discountType
          value
        }
      }
    }
  }
`);

const feeDebtorsQuery = (filter: FeeFilter) => ({
  queryKey: feeKeys.debtors(filter),
  queryFn: () => gqlClient.request(feeDebtors, { filter }),
});

export function getFeeDebtors(filter: FeeFilter) {
  return queryClient.fetchQuery(feeDebtorsQuery(filter));
}

export function useFeeDebtors(filter: FeeFilter) {
  return useQuery({
    ...feeDebtorsQuery(filter),
    select: ({ fees_fees }) => (fees_fees.length ? fees_fees[0].debtors : []),
  });
}

export type ReturnTypeFromUseFeeDebtors = UseQueryReturnType<
  typeof useFeeDebtors
>[number];
