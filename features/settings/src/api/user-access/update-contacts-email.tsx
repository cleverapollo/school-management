import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  UpdateStudentContactInput,
} from '@tyro/api';

import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { userAccessKeys } from './keys';

const updateStudentContactsEmail = graphql(/* GraphQL */ `
  mutation core_updateStudentContacts($input: [UpdateStudentContactInput!]!) {
    core_updateStudentContacts(input: $input) {
      success
    }
  }
`);

export function useUpdateStudentContactsEmail() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();
  return useMutation({
    mutationFn: (
      input: UpdateStudentContactInput | UpdateStudentContactInput[]
    ) =>
      gqlClient.request(updateStudentContactsEmail, {
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
