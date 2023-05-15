import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleContactsKeys } from './keys';

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

const contactsQuery = {
  queryKey: peopleContactsKeys.all,
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
