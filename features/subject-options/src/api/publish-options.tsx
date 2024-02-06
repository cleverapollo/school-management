import { useMutation } from '@tanstack/react-query';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { gqlClient, graphql, OptionsPublish, queryClient } from '@tyro/api';
import { optionsKeys } from './keys';

const publishOptions = graphql(/* GraphQL */ `
  mutation options_publish($input: OptionsPublish!) {
    options_publish(input: $input) {
      success
    }
  }
`);

export function usePublishOptions() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: OptionsPublish) =>
      gqlClient.request(publishOptions, { input }),
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries(optionsKeys.all);
      toast(
        variables?.publish
          ? t('common:snackbarMessages.publishedSuccess')
          : t('common:snackbarMessages.unpublishedSuccess')
      );
    },
  });
}
