import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql, SendSmsInput } from '@tyro/api';

const sendSms = graphql(/* GraphQL */ `
  mutation sendSms($input: SendSmsInput) {
    communications_sendSms(input: $input)
  }
`);

export function useSendSms() {
  return useMutation({
    mutationFn: (input: SendSmsInput) => gqlClient.request(sendSms, { input }),
    onSuccess: () => {
      // TODO: Invalidate sms list query when built for other page
      // queryClient.invalidateQueries(assessmentsKeys.all);
    },
  });
}
