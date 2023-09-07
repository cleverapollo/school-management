import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_LinkSiblingsAndContacts,
  Core_ModifyBlocks, Core_ModifyMemberships,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { groupsKeys } from './keys';

const modifyGroupMembership = graphql(/* GraphQL */ `
  mutation core_modifyGroupMemberships($input: Core_ModifyMemberships!) {
      core_modifyGroupMemberships(input: $input) {
      success
    }
  }
`);

export function useModifyGroupMemberships() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: Core_ModifyMemberships) =>
      gqlClient.request(modifyGroupMembership, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(groupsKeys.support.all());
      await queryClient.invalidateQueries(groupsKeys.subject.all());
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
