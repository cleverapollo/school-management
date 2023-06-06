import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, SendSmsInput } from '@tyro/api';
import { useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { smsKeys } from './keys';

const sendSms = graphql(/* GraphQL */ `
  mutation sendSms($input: SendSmsInput) {
    communications_sendSms(input: $input)
  }
`);

export function useSendSms() {
  const { toast } = useToast();
  const { t } = useTranslation(['sms']);

  return useMutation({
    mutationFn: (input: SendSmsInput) => gqlClient.request(sendSms, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries(smsKeys.all);
      toast(t('sms:smsSentSuccessfully'));
    },
    onError: () => {
      toast(t('sms:smsFailedToSend'), { variant: 'error' });
    },
  });
}
