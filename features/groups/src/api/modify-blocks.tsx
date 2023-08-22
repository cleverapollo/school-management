import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_LinkSiblingsAndContacts,
  Core_ModifyBlocks,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { groupsKeys } from './keys';

const modifyBlocks = graphql(/* GraphQL */ `
  mutation core_modifyBlocks($input: Core_ModifyBlocks!) {
    core_modifyBlocks(input: $input) {
      success
    }
  }
`);

export function useModifyBlocks() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: Core_ModifyBlocks) =>
      gqlClient.request(modifyBlocks, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(groupsKeys.class.all());
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
