import { useMutation } from '@tanstack/react-query';

import { gqlClient, queryClient, TtSolve_SolveParams } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { timetableKeys } from '../keys';

const solveCurrentBest = /* GraphQL */ `
  mutation ttsolve_currentBest($input: TtSolve_SolveParams) {
    ttsolve_currentBest(input: $input) {
      score
      lessonsTotal
      lessonsScheduled
      solverStatus
    }
  }
`;

export function useSolveCurrentBest() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: TtSolve_SolveParams) =>
      gqlClient.request(solveCurrentBest, { input }),
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
      queryClient.invalidateQueries(timetableKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
