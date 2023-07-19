import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  DeleteStudentMedicalConditionInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../../keys';

const deleteStudentMedicalCondition = graphql(/* GraphQL */ `
  mutation wellbeing_deleteStudentMedicalCondition(
    $input: DeleteStudentMedicalConditionInput!
  ) {
    wellbeing_deleteStudentMedicalCondition(input: $input) {
      studentPartyId
      conditions {
        id
        name
        description
      }
    }
  }
`);

export function useDeleteCondition() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: DeleteStudentMedicalConditionInput) =>
      gqlClient.request(deleteStudentMedicalCondition, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.deleteSuccess'));
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
