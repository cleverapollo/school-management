import { useMutation } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  Wellbeing_DeleteStudentAenInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { peopleKeys } from '../../keys';

const deleteStudentAenCondition = graphql(/* GraphQL */ `
  mutation wellbeing_deleteStudentAen(
    $input: Wellbeing_DeleteStudentAenInput!
  ) {
    wellbeing_deleteStudentAen(input: $input) {
      success
    }
  }
`);

export function useDeleteAen() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Wellbeing_DeleteStudentAenInput) =>
      gqlClient.request(deleteStudentAenCondition, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.deleteSuccess'));
      queryClient.invalidateQueries(peopleKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
