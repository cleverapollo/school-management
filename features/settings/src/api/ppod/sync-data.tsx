import { useMutation } from '@tanstack/react-query';
import { useTranslation } from '@tyro/i18n';
import {
  queryClient,
  fetchClient,
  UseQueryReturnType,
  SyncRequest,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { ppodSyncKeys } from './keys';

export function useSyncFromPpodQuery() {
  const { toast } = useToast();
  const { t } = useTranslation(['common', 'settings']);

  return useMutation({
    mutationFn: () =>
      fetchClient<SyncRequest>('/api/ppod/sync', {
        method: 'POST',
        bodyType: 'json',
      }),
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
  });
}

export type ReturnTypeFromUseSyncFromPpodQuery = UseQueryReturnType<
  typeof useSyncFromPpodQuery
>;
