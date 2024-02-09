import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  gqlClient,
  graphql,
  queryClient,
  Options_SaveOptions,
} from '@tyro/api';
import { optionsKeys } from './keys';

const saveSubjectOptions = graphql(/* GraphQL */ `
  mutation options_saveOptions($input: Options_SaveOptions!) {
    options_saveOptions(input: $input) {
      id
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
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(optionsKeys.all);
      toast(
        variables?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
  });
}
