import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  UseQueryReturnType,
  queryClient,
  RecipientFilter,
} from '@tyro/api';
import { mailKeys } from './keys';

const resolveMailRecipientsSchema = graphql(/* GraphQL */ `
  query communications_recipients($filter: RecipientFilter) {
    communications_recipients(filter: $filter) {
      partyId
      type
      text
      avatarUrl
    }
  }
`);

const resolveMailRecipientsQuery = (filter: RecipientFilter) => ({
  queryKey: mailKeys.resolveRecipients(filter),
  queryFn: async () =>
    gqlClient.request(resolveMailRecipientsSchema, { filter }),
});

export function useResolveMailRecipients(filter: RecipientFilter) {
  return useQuery({
    ...resolveMailRecipientsQuery(filter),
    select: ({ communications_recipients }) => communications_recipients,
  });
}

export function resolveMailRecipients(filter: RecipientFilter) {
  return queryClient.fetchQuery(resolveMailRecipientsQuery(filter));
}

export type ReturnTypeUseResolveMailRecipients = UseQueryReturnType<
  typeof useResolveMailRecipients
>[number];
