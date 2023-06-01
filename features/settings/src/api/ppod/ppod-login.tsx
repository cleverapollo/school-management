import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SavePpodCredentials,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { ppodSyncKeys } from './keys';

const savePpodCredentials = graphql(/* GraphQL */ `
  mutation ppod_savePPODCredentials($input: SavePPODCredentials!) {
    ppod_savePPODCredentials(input: $input) {
      username
      password
    }
  }
`);

export function useSavePpodCredentials() {
  const { t } = useTranslation(['common', 'settings']);
  const { toast } = useToast();

  return useMutation({
    mutationKey: ppodSyncKeys.savePpodCredentials(),
    mutationFn: (input: SavePpodCredentials) =>
      gqlClient.request(savePpodCredentials, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...ppodSyncKeys.all],
      });
      toast(t('settings:ppodSync.credentialsCorrect'));
    },
    onError: () => {
      toast(t('settings:ppodSync.incorrectCredentials'), {
        variant: 'error',
      });
    },
  });
}
