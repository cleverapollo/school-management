import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  queryClient,
  graphql,
  SyncRequestsFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { ppodSyncKeys } from './keys';

const syncRequests = graphql(/* GraphQL */ `
  query ppod_syncRequests($filter: SyncRequestsFilter!) {
    ppod_syncRequests(filter: $filter) {
      id
      syncRequestStatus
      requesterPartyId
      requester {
        partyId
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
        type
      }
      failureReason
      requestedOn
    }
  }
`);

const syncRequestsQuery = (filter: SyncRequestsFilter) => ({
  queryKey: ppodSyncKeys.syncRequests(filter),
  queryFn: async () => gqlClient.request(syncRequests, { filter }),
});

export function getSyncRequests(filter: SyncRequestsFilter) {
  return queryClient.fetchQuery(syncRequestsQuery(filter));
}

export function useSyncRequests(filter: SyncRequestsFilter) {
  return useQuery({
    ...syncRequestsQuery(filter),
    select: ({ ppod_syncRequests }) => {
      if (!Array.isArray(ppod_syncRequests)) return [];
      return ppod_syncRequests;
    },
  });
}

export type ReturnTypeFromUseSyncRequests = UseQueryReturnType<
  typeof useSyncRequests
>[number];
