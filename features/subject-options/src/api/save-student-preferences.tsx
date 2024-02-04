import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { gqlClient, graphql, SaveStudentPreference } from '@tyro/api';

const saveStudentPreferences = graphql(/* GraphQL */ `
  mutation options_saveStudentPreferences($input: [SaveStudentPreference]!) {
    options_saveStudentPreferences(input: $input) {
      success
    }
  }
`);

export function useSaveStudentPreferences() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveStudentPreference[]) =>
      gqlClient.request(saveStudentPreferences, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: () => {
      toast(t('common:snackbarMessages.updateSuccess'));
    },
  });
}
