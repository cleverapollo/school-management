import { useMutation } from '@tanstack/react-query';

import {
  DeleteStudentMedicalContactInput,
  gqlClient,
  queryClient,
  graphql,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../../keys';

const deleteMedicalProfessional = graphql(/* GraphQL */ `
  mutation wellbeing_deleteStudentMedicalContact(
    $input: DeleteStudentMedicalContactInput!
  ) {
    wellbeing_deleteStudentMedicalContact(input: $input) {
      studentPartyId
      medicalContacts {
        id
      }
    }
  }
`);

export function useDeleteMedicalProfessional() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: DeleteStudentMedicalContactInput) =>
      gqlClient.request(deleteMedicalProfessional, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.deleteSuccess'));
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
