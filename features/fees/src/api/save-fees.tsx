import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, SaveFeeInput } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { feeKeys } from './keys';

const saveFee = graphql(/* GraphQL */ `
  mutation fees_saveFee($input: SaveFeeInput) {
    fees_saveFee(input: $input) {
      id
    }
  }
`);

export function useSaveFee() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveFeeInput) =>
      gqlClient.request(saveFee, { input }),
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
