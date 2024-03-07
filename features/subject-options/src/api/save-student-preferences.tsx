import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  gqlClient,
  graphql,
  queryClient,
  Options_SaveStudentPreference,
  Options_OptionIdFilter,
} from '@tyro/api';
import { optionsKeys } from './keys';

const saveStudentPreferences = graphql(/* GraphQL */ `
  mutation options_saveStudentPreferences(
    $input: [Options_SaveStudentPreference]!
  ) {
    options_saveStudentPreferences(input: $input) {
      success
    }
  }
`);

const autoGeneratePreferences = graphql(/* GraphQL */ `
  mutation optionsSol_fillInOptions($input: Options_OptionIdFilter!) {
    optionsSol_fillInOptions(input: $input) {
      success
    }
  }
`);

export function useSaveStudentPreferences() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Options_SaveStudentPreference[]) =>
      gqlClient.request(saveStudentPreferences, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(optionsKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
  });
}

export function useAutoGenerateStudentPreferences() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Options_OptionIdFilter) =>
      gqlClient.request(autoGeneratePreferences, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(optionsKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
  });
}
