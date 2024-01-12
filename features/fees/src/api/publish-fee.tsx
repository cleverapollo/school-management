import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, PublishInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { feeKeys } from './keys';

const publishFee = graphql(/* GraphQL */ `
  mutation fees_publish($input: PublishInput!) {
    fees_publish(input: $input) {
      success
    }
  }
`);

export function usePublishFee() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: PublishInput) =>
      gqlClient.request(publishFee, { input }),
    onSuccess: async (_, data) => {
      await queryClient.invalidateQueries(feeKeys.all);
      toast(
        t(
          `common:snackbarMessages.${
            data.publish ? 'publishedSuccess' : 'unpublishedSuccess'
          }`
        )
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
