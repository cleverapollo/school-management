import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_ModifySubjectGroupMembershipType,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { groupsKeys } from './keys';

const modifySubjectGroup = graphql(/* GraphQL */ `
  mutation coreModifySubjectGroupMembershipType(
    $input: [Core_ModifySubjectGroupMembershipType]!
  ) {
    core_modifySubjectGroupMembershipType(input: $input) {
      success
    }
  }
`);

export function useModifySubjectGroup() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: Core_ModifySubjectGroupMembershipType[]) =>
      gqlClient.request(modifySubjectGroup, { input }),
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
