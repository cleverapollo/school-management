import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, FeeExclusionInput } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useToast } from '@tyro/core';
import { feeKeys } from './keys';

const excludeStudentsFromFee = graphql(/* GraphQL */ `
  mutation fees_excludeFromFee($input: FeeExclusionInput!) {
    fees_excludeFromFee(input: $input) {
      success {
        success
      }
      validations
    }
  }
`);

export function useExcludeStudentsFromFee() {
  const { t } = useTranslation(['common']);
  const { toast } = useToast();

  return useMutation({
    mutationFn: (input: FeeExclusionInput) =>
      gqlClient.request(excludeStudentsFromFee, { input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries(feeKeys.all);
      toast(t('common:snackbarMessages.createSuccess'));
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
