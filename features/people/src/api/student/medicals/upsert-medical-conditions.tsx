import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  UpsertStudentMedicalConditionInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../../keys';

const upsertStudentMedicalCondition = graphql(/* GraphQL */ `
  mutation wellbeing_upsertStudentMedicalCondition(
    $input: UpsertStudentMedicalConditionInput!
  ) {
    wellbeing_upsertStudentMedicalCondition(input: $input) {
      studentPartyId
      conditions {
        id
        name
        description
        equipment {
          id
          name
          location
        }
      }
    }
  }
`);

export function useCreateOrUpdateCondition() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: UpsertStudentMedicalConditionInput) =>
      gqlClient.request(upsertStudentMedicalCondition, { input }),
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
