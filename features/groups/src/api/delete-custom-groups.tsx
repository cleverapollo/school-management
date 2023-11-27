import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_DeleteGroupInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { groupsKeys } from './keys';

const deleteCustomGroups = graphql(/* GraphQL */ `
  mutation core_deleteGroups($input: Core_DeleteGroupInput!) {
    core_deleteGroups(input: $input) {
      success
    }
  }
`);

export function useDeleteCustomGroups() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Core_DeleteGroupInput) =>
      gqlClient.request(deleteCustomGroups, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(groupsKeys.custom.groups());
      toast(t('common:snackbarMessages.deleteSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
