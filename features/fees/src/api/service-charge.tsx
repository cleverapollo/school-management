import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  ChargesFilter,
} from '@tyro/api';
import { feeKeys } from './keys';

const serviceCharge = graphql(/* GraphQL */ `
  query fees_serviceCharges($filter: ChargesFilter) {
    fees_serviceCharges(filter: $filter) {
      amount
      userServiceCharge
      userVat
    }
  }
`);

const serviceChargeQuery = (filter: ChargesFilter) => ({
  queryKey: feeKeys.serviceCharge(filter),
  queryFn: () => gqlClient.request(serviceCharge, { filter }),
});

export function getServiceCharge(filter: ChargesFilter) {
  return queryClient.fetchQuery(serviceChargeQuery(filter));
}

export function useServiceCharge(filter: ChargesFilter) {
  return useQuery({
    ...serviceChargeQuery(filter),
    keepPreviousData: true,
    select: ({ fees_serviceCharges }) => fees_serviceCharges,
  });
}

export type ReturnTypeFromUseServiceCharge = UseQueryReturnType<
  typeof useServiceCharge
>;
