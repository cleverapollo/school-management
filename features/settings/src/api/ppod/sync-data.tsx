import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@tyro/i18n';
import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';
import { useToast } from '@tyro/core';
import { ppodSyncKeys } from './keys';

const syncFromPpod = graphql(/* GraphQL */ `
  query ppod_syncPPOD {
    ppod_syncPPOD {
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
      requestedOn
    }
  }
`);

const syncFromPpodQuery = {
  queryKey: ppodSyncKeys.syncFromPpod(),
  queryFn: async () => gqlClient.request(syncFromPpod),
};

export function getSyncFromPpodQuery() {
  return queryClient.fetchQuery(syncFromPpodQuery);
}

export function useSyncFromPpodQuery() {
  const { toast } = useToast();
  const { t } = useTranslation(['common', 'settings']);

  return useQuery({
    ...syncFromPpodQuery,
    select: ({ ppod_syncPPOD }) => {
      if (!Array.isArray(ppod_syncPPOD)) return [];
      return ppod_syncPPOD;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(ppodSyncKeys.all);
      toast(t('settings:ppodSync.syncSuccessful'), {
        variant: 'success',
      });
    },
    onError: () => {
      toast(t('settings:ppodSync.syncUnsuccessful'), {
        variant: 'error',
      });
    },
    enabled: false,
  });
}

export type ReturnTypeFromUseSyncFromPpodQuery = UseQueryReturnType<
  typeof useSyncFromPpodQuery
>;
