import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  SmsFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { smsKeys } from './keys';

const sentSms = graphql(/* GraphQL */ `
  query communications_sms($filter: SmsFilter) {
    communications_sms(filter: $filter) {
      id
      name
      sender {
        title {
          id
          name
          nameTextId
        }
        firstName
        lastName
        avatarUrl
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
          title {
            id
            name
            nameTextId
          }
          firstName
          lastName
          avatarUrl
          type
        }
        recipientPhoneNumber
        smsStatus
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

export function getSentSms(filter: SmsFilter) {
  return queryClient.fetchQuery(sentSmsQuery(filter));
}

export type ReturnTypeFromUseSentSms =
  | UseQueryReturnType<typeof useSentSms>[number]
  | null;
