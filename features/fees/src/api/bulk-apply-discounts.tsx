import { useMutation } from '@tanstack/react-query';
import {
  BulkApplyIndividualDiscountInput,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { feeKeys } from './keys';

const bulkApplyDiscounts = graphql(/* GraphQL */ `
  mutation fees_bulkApplyIndividualDiscounts(
    $input: BulkApplyIndividualDiscountInput
  ) {
    fees_bulkApplyIndividualDiscounts(input: $input) {
      success
    }
  }
`);

export function useBulkApplyDiscounts() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: BulkApplyIndividualDiscountInput) =>
      gqlClient.request(bulkApplyDiscounts, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(feeKeys.all);
      toast(t('common:snackbarMessages.updateSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
