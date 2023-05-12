import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, SmsFilter } from '@tyro/api';
import { smsKeys } from './keys';

const sentSms = graphql(/* GraphQL */ `
  query communications_sms($filter: SmsFilter) {
    communications_sms(filter: $filter) {
      id
      name
      sender {
        title
        firstName
        lastName
        type
      }
      body
      sentOn
      canReply
      numRecipients
      totalCost
      recipients {
        id {
          tenant
          smsId
          recipientPartyId
        }
        recipient {
          title
          firstName
          lastName
          avatarUrl
          type
        }
        recipientPhoneNumber
        smsSuccess
      }
    }
  }
`);

const sentSmsQuery = (filter: SmsFilter) => ({
  queryKey: smsKeys.sent(),
  queryFn: () => gqlClient.request(sentSms, { filter }),
});

export function useSentSms(filter: SmsFilter) {
  return useQuery({
    ...sentSmsQuery(filter),
    select: ({ communications_sms }) => communications_sms,
  });
}

export function getAttendanceCodes(filter: SmsFilter) {
  return queryClient.fetchQuery(sentSmsQuery(filter));
}
