import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  gqlClient,
  graphql,
  queryClient,
  OptionsSol_Solve,
  OptionsSol_SolverOperation,
} from '@tyro/api';
import { optionsKeys } from './keys';

const solveOptions = graphql(/* GraphQL */ `
  mutation optionsSol_solve($input: OptionsSol_Solve!) {
    optionsSol_solve(input: $input) {
      success
    }
  }
`);

export function useSolveOptions() {
  const { toast } = useToast();
  const { t } = useTranslation(['common', 'subjectOptions']);

  return useMutation({
    mutationFn: async (input: OptionsSol_Solve) =>
      gqlClient.request(solveOptions, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(optionsKeys.all);

      toast(
        variables.operation === OptionsSol_SolverOperation.Stop
          ? t('subjectOptions:optionsSolverStoppedSuccessfully')
          : t('subjectOptions:optionsSolverStartedSuccessfully')
      );
    },
  });
}
