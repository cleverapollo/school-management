import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  Core_UpdateStudentSubjectGroupInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const updateStudentSubjectGroup = graphql(/* GraphQL */ `
  mutation core_updateStudentSubjectGroup(
    $input: [Core_UpdateStudentSubjectGroupInput]!
  ) {
    core_updateStudentSubjectGroup(input: $input) {
      success
    }
  }
`);

export function useUpdateStudentSubjectGroup() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Core_UpdateStudentSubjectGroupInput[]) =>
      gqlClient.request(updateStudentSubjectGroup, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(peopleKeys.students.all());
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
