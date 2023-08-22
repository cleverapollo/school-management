import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  queryClient,
  graphql,
  UpsertStudentMedicalContactInput,
  Wellbeing_UpsertStudentAenInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../../keys';

const upsertStudentAen = graphql(/* GraphQL */ `
  mutation wellbeing_upsertStudentAen(
    $input: Wellbeing_UpsertStudentAenInput!
  ) {
    wellbeing_upsertStudentAen(input: $input) {
      success
    }
  }
`);

export function useUpsertStudentAen() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Wellbeing_UpsertStudentAenInput) =>
      gqlClient.request(upsertStudentAen, { input }),
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
