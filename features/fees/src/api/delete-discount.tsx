import { useMutation } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  DeleteDiscountInput,
} from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { feeKeys } from './keys';

const deleteDiscount = graphql(/* GraphQL */ `
  mutation fees_deleteDiscount($input: DeleteDiscountInput!) {
    fees_deleteDiscount(input: $input) {
      success
    }
  }
`);

type ErrorWithResponse = Error & {
  response?: {
    error?: string;
  };
};

export function useDeleteDiscount() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: DeleteDiscountInput) =>
      gqlClient.request(deleteDiscount, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(feeKeys.all);
      toast(t('common:snackbarMessages.deleteSuccess'));
    },
    onError: (error) => {
      const errorWithResponse = error as ErrorWithResponse;
      let customErrorMessage = '';

      if (errorWithResponse?.response?.error) {
        const errorDetail = JSON.parse(errorWithResponse.response.error) as {
          detail?: string;
        };
        customErrorMessage = errorDetail?.detail || '';
      }

      toast(customErrorMessage || t('common:snackbarMessages.errorFailed'), {
        variant: 'error',
      });
    },
  });
}
