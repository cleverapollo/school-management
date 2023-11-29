import { useMutation } from '@tanstack/react-query';
import {
  EmulateHeaders,
  gqlClient,
  graphql,
  queryClient,
  MakePaymentInput,
  useAcademicNamespace,
} from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { feeKeys } from './keys';

const createPayment = graphql(/* GraphQL */ `
  mutation createPayment($input: MakePaymentInput) {
    fees_createPayment(input: $input) {
      clientSecret
    }
  }
`);

export function useCreatePayment() {
  const { toast } = useToast();
  const { t } = useTranslation(['common']);

  return useMutation({
    mutationFn: (input: MakePaymentInput) =>
      gqlClient.request(createPayment, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(feeKeys.all);
    },
    onError: () => {
      toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
    },
  });
}
