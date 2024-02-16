import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { gqlClient, graphql, Options_SaveOptions } from '@tyro/api';

const saveSubjectOptions = graphql(/* GraphQL */ `
  mutation options_saveOptions($input: Options_SaveOptions!) {
    options_saveOptions(input: $input) {
      id
      validations
    }
  }
`);

export function useSaveSubjectOptionsSetup() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: Options_SaveOptions) =>
      gqlClient.request(saveSubjectOptions, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
