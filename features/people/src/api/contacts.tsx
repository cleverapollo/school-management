import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

const contacts = graphql(/* GraphQL */ `
  query core_studentContacts {
    core_studentContacts {
      partyId
      person {
        avatarUrl
        firstName
        lastName
      }
      personalInformation {
        preferredFirstName
        primaryPhoneNumber {
          number
        }
        primaryEmail {
          email
        }
      }
    }
  }
`);

export const contactKeys = {
  all: ['people', 'contacts'] as const,
  details: (studentId: number | undefined) =>
    [...contactKeys.all, studentId] as const,
};

const contactsQuery = {
  queryKey: contactKeys.all,
  queryFn: async () => gqlClient.request(contacts),
};

export function getContacts() {
  return queryClient.fetchQuery(contactsQuery);
}

export function useContacts() {
  return useQuery({
    ...contactsQuery,
    select: ({ core_studentContacts }) => core_studentContacts,
  });
}
