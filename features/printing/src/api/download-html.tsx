import { useMutation } from '@tanstack/react-query';
import { useTranslation } from '@tyro/i18n';
import {
  queryClient,
  fetchClient,
  UseQueryReturnType,
  SyncRequest,
} from '@tyro/api';
import { useToast } from '@tyro/core';

export function useDownloadHtml() {
  const { toast } = useToast();
  const { t } = useTranslation(['common', 'settings']);

  return useMutation({
    mutationFn: (uuid: string) =>
      fetchClient<string>(`/api/download/${uuid}`, {
        method: 'GET',
        bodyType: 'text',
      }),
    onSuccess: () => {
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
  typeof useDownloadHtml
>;
