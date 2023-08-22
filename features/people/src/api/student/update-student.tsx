import { useMutation } from '@tanstack/react-query';

import { UpdateStudentInput, gqlClient, queryClient, graphql } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const updateStudent = graphql(/* GraphQL */ `
  mutation updateStudent($input: [UpdateStudentInput]!) {
    core_updateStudents(input: $input) {
      success
    }
  }
`);

export function useUpdateStudent() {
  const { toast } = useToast();
  const { t } = useTranslation(['people']);

  return useMutation({
    mutationFn: async (input: [UpdateStudentInput]) =>
      gqlClient.request(updateStudent, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(peopleKeys.students.all());
      toast(t('people:successfullyUpdatedStudent'));
    },
    onError: () => {
      toast(t('people:updatedStudentUnsuccessful'), {
        variant: 'error',
      });
    },
  });
}
