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
      // NOTE: according to Ian, once the credentials are successfully we need to redirect to the sync page
      // this way, we set the flag which is used in the loader to check if the user is logged in
      queryClient.setQueryData(ppodSyncKeys.ppodCredentialsStatus(), () => ({
        ppod_PPODCredentials: { lastSyncSuccessful: true },
      }));
      toast(t('settings:ppodSync.credentialsCorrect'));
    },
    onError: () => {
      toast(t('settings:ppodSync.incorrectCredentials'), {
        variant: 'error',
      });
    },
  });
}
