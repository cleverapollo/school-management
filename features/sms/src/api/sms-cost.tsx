import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, SmsCostFilter } from '@tyro/api';
import { smsKeys } from './keys';

const smsCost = graphql(/* GraphQL */ `
  query communications_smsCost($filter: SmsCostFilter) {
    communications_smsCost(filter: $filter) {
      total
    }
  }
`);

const smsCostQuery = (filter: SmsCostFilter) => ({
  queryKey: smsKeys.cost(filter),
  queryFn: () => gqlClient.request(smsCost, { filter }),
  staleTime: 1000 * 60 * 60,
});

export function useSmsCostPerMessage(filter: SmsCostFilter) {
  return useQuery({
    ...smsCostQuery(filter),
    select: ({ communications_smsCost }) => communications_smsCost?.total ?? 0,
    enabled: !!filter.recipients?.length,
    keepPreviousData: true,
  });
}
