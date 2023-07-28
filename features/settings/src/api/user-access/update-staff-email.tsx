import { useMutation } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, UpdateStaffInput } from '@tyro/api';

import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { userAccessKeys } from './keys';

const updateStaffEmail = graphql(/* GraphQL */ `
  mutation core_updateStaff($input: [UpdateStaffInput!]!) {
    core_updateStaff(input: $input) {
      success
    }
  }
`);

export function useUpdateStaffEmail() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: UpdateStaffInput[]) =>
      gqlClient.request(updateStaffEmail, {
        input,
      }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      queryClient.invalidateQueries(userAccessKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
