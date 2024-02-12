import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { gqlClient, graphql, Options_Clone, queryClient } from '@tyro/api';
import { optionsKeys } from './keys';

const cloneOptions = graphql(/* GraphQL */ `
  mutation options_clone($input: Options_Clone!) {
    options_clone(input: $input) {
      success
    }
  }
`);

export function useCloneOptions() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Options_Clone) =>
      gqlClient.request(cloneOptions, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(optionsKeys.all);
      toast(t('common:snackbarMessages.clonedSuccess'));
    },
  });
}
