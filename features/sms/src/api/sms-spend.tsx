import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { smsKeys } from './keys';

const smsSpend = graphql(/* GraphQL */ `
  query communications_currentMonthlySpend {
    communications_currentMonthlySpend {
      currentMonthlySpend
    }
  }
`);

const smsSpendQuery = () => ({
  queryKey: smsKeys.spend(),
  queryFn: () => gqlClient.request(smsSpend),
  staleTime: 0,
});

export function useSmsSpend() {
  return useQuery({
    ...smsSpendQuery(),
    select: ({ communications_currentMonthlySpend }) =>
      communications_currentMonthlySpend?.currentMonthlySpend ?? 0,
  });
}

export function getSmsSpend() {
  return queryClient.fetchQuery(smsSpendQuery());
}
