import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  gqlClient,
  graphql,
  queryClient,
  Options_SaveStudentPreference,
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
