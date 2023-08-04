import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  UpsertStudentMedicalContactInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../../keys';

const upsertMedicalProfessional = graphql(/* GraphQL */ `
  mutation wellbeing_upsertStudentMedicalContact(
    $input: UpsertStudentMedicalContactInput!
  ) {
    wellbeing_upsertStudentMedicalContact(input: $input) {
      studentPartyId
      medicalContacts {
        id
        personalTitleId
        firstName
        lastName
        addressLine1
        addressLine2
        addressLine3
        county
        postcode
        primaryPhone
        email
        occupation
      }
    }
  }
`);

export function useCreateOrUpdateMedicalProfessional() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: UpsertStudentMedicalContactInput) =>
      gqlClient.request(upsertMedicalProfessional, { input }),
    onSuccess: (_, variables) => {
      toast(
        variables?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
