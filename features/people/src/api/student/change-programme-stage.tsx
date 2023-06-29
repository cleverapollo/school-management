import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  EnrollmentIre_ChangeProgrammeStage,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../keys';

const changeProgrammeStage = graphql(/* GraphQL */ `
  mutation enrollment_ire_changeProgrammeStage(
    $input: [EnrollmentIre_ChangeProgrammeStage!]!
  ) {
    enrollment_ire_changeProgrammeStage(input: $input) {
      success
    }
  }
`);

export function useChangeProgrammeStage() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: EnrollmentIre_ChangeProgrammeStage[]) =>
      gqlClient.request(changeProgrammeStage, { input }),
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
