import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, SaveDiscountInput } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { feeKeys } from './keys';

const saveDiscount = graphql(/* GraphQL */ `
  mutation fees_saveDiscount($input: SaveDiscountInput) {
    fees_saveDiscount(input: $input) {
      id
    }
  }
`);

export function useSaveDiscount() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveDiscountInput) =>
      gqlClient.request(saveDiscount, { input }),
    onSuccess: async (_, discount) => {
      await queryClient.invalidateQueries(feeKeys.all);

      toast(
        discount?.id
          ? t('common:snackbarMessages.updateSuccess')
          : t('common:snackbarMessages.createSuccess')
      );
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
