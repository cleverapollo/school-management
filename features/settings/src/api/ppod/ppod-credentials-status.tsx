import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { ppodSyncKeys } from './keys';

const ppodCredentials = graphql(/* GraphQL */ `
  query ppod_PPODCredentials {
    ppod_PPODCredentials {
      username
      password
      lastSyncSuccessful
    }
  }
`);

const ppodCredentialsStatus = {
  queryKey: ppodSyncKeys.ppodCredentialsStatus(),
  queryFn: async () => gqlClient.request(ppodCredentials),
};

export function getPpodCredentialsStatus() {
  return queryClient.fetchQuery(ppodCredentialsStatus);
}

export function usePpodCredentialsStatus() {
  return useQuery({
    ...ppodCredentialsStatus,
    select: ({ ppod_PPODCredentials }) =>
      ppod_PPODCredentials?.lastSyncSuccessful,
  });
}

export type ReturnTypeFromUsePpodCredentialsStatus = UseQueryReturnType<
  typeof usePpodCredentialsStatus
>;
