import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, SaveCategoryInput } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { feeKeys } from './keys';

const saveFeeCategory = graphql(/* GraphQL */ `
  mutation fees_saveCategory($input: SaveCategoryInput) {
    fees_saveCategory(input: $input) {
      id
    }
  }
`);

export function useSaveFeeCategory() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: async (input: SaveCategoryInput) =>
      gqlClient.request(saveFeeCategory, { input }),
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
