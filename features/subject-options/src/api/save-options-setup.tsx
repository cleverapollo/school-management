import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { gqlClient, graphql, SaveOptions } from '@tyro/api';

const saveSubjectOptions = graphql(/* GraphQL */ `
  mutation options_saveOptions($input: SaveOptions!) {
    options_saveOptions(input: $input) {
      id
    }
  }
`);

export function useSaveSubjectOptionsSetup() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveOptions) =>
      gqlClient.request(saveSubjectOptions, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: (_, variables) => {
      toast(
        variables?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
  });
}
