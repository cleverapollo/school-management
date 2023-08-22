import { useMutation } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, UpdateStudentInput } from '@tyro/api';

import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import { userAccessKeys } from './keys';

const updateStudentEmail = graphql(/* GraphQL */ `
  mutation core_updateStudent($input: [UpdateStudentInput!]!) {
    core_updateStudents(input: $input) {
      success
    }
  }
`);

export function useUpdateStudentEmail() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();
  return useMutation({
    mutationFn: (input: UpdateStudentInput | UpdateStudentInput[]) =>
      gqlClient.request(updateStudentEmail, {
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
