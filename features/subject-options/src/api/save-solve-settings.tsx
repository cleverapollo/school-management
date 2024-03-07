import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  gqlClient,
  graphql,
  OptionsSol_ModifySolutionSettings,
  queryClient,
} from '@tyro/api';
import { optionsKeys } from './keys';

const saveSolveSettings = graphql(/* GraphQL */ `
  mutation optionsSol_modifySolutionSettings(
    $input: OptionsSol_ModifySolutionSettings!
  ) {
    optionsSol_modifySolutionSettings(input: $input) {
      success
    }
  }
`);

export function useSaveSolveSettings() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: OptionsSol_ModifySolutionSettings) =>
      gqlClient.request(saveSolveSettings, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(optionsKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'), { variant: 'success' });
    },
  });
}
