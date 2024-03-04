import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  gqlClient,
  graphql,
  queryClient,
  OptionsSol_Solve,
  OptionsSol_SolverOperation,
  BackendErrorResponse,
  ParsedErrorDetail,
} from '@tyro/api';
import { optionsKeys } from './keys';

const solveOptions = graphql(/* GraphQL */ `
  mutation optionsSol_solve($input: OptionsSol_Solve!) {
    optionsSol_solve(input: $input) {
      problemId
    }
  }
`);

export function useSolveOptions() {
  const { toast } = useToast();
  const { t } = useTranslation(['common', 'subjectOptions']);

  return useMutation({
    mutationFn: async (input: OptionsSol_Solve) =>
      gqlClient.request(solveOptions, { input }),
    onError: async (error: unknown) => {
      let errorMessage = t('common:snackbarMessages.errorFailed');

      if (typeof error === 'object' && error !== null) {
        const backendError = error as BackendErrorResponse;
        try {
          const parsedError = JSON.parse(
            backendError.response.error
          ) as ParsedErrorDetail;
          errorMessage = parsedError.detail || errorMessage;
          await queryClient.invalidateQueries(optionsKeys.all);
        } catch (parseError) {
          console.error('Error parsing the error message:', parseError);
        }
      }

      const errorToastMessage = errorMessage?.replace(/\..*/, '');
      toast(errorToastMessage, { variant: 'error' });
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
