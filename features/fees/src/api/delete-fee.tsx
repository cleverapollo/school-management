import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, DeleteFeeInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { feeKeys } from './keys';

const deleteFee = graphql(/* GraphQL */ `
  mutation fees_deleteFee($input: DeleteFeeInput!) {
    fees_deleteFee(input: $input) {
      success
    }
  }
`);

export function useDeleteFee() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: DeleteFeeInput) =>
      gqlClient.request(deleteFee, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(feeKeys.all);
      toast(t('common:snackbarMessages.deleteSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
