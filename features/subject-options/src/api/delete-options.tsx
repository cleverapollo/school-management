import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { gqlClient, graphql, queryClient, DeleteOption } from '@tyro/api';
import { optionsKeys } from './keys';

const deleteOptions = graphql(/* GraphQL */ `
  mutation options_delete($input: DeleteOption!) {
    options_delete(input: $input) {
      success
    }
  }
`);

export function useDeleteOptions() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: DeleteOption) =>
      gqlClient.request(deleteOptions, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(optionsKeys.all);
      toast(t('common:snackbarMessages.deleteSuccess'));
    },
  });
}
