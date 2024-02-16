import { useMutation } from '@tanstack/react-query';

import { gqlClient, queryClient, TtSolve_SolveParams } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { timetableKeys } from '../keys';

const solveTimetable = /* GraphQL */ `
  mutation ttsolve_solve($input: TtSolve_SolveParams) {
    ttsolve_solve(input: $input) {
      success
    }
  }
`;

export function useSolveTimetable() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: TtSolve_SolveParams) =>
      gqlClient.request(solveTimetable, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      queryClient.invalidateQueries(timetableKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
