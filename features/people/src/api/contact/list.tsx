import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleKeys } from '../keys';

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
        primaryAddress {
          line1
          line2
          line3
          city
          country
          postCode
        }
        primaryPhoneNumber {
          number
        }
        primaryEmail {
          email
        }
      }
      relationships {
        student {
          person {
            avatarUrl
            firstName
            lastName
          }
        }
      }
    }
  }
`);

const contactsInfoForSelect = graphql(/* GraphQL */ `
  query core_studentContactsForSelect {
    core_studentContacts {
      person {
        partyId
        title {
          nameTextId
          id
          name
        }
        firstName
        lastName
        avatarUrl
        type
      }
    }
  }
`);

const contactsQuery = {
  queryKey: peopleKeys.contacts.all(),
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

const contactsForSelectQuery = () => ({
  queryKey: peopleKeys.contacts.forSelect(),
  queryFn: async () => gqlClient.request(contactsInfoForSelect),
});

export function getContactsForSelect() {
  return queryClient.fetchQuery(contactsForSelectQuery());
}

export function useContactsForSelect() {
  return useQuery({
    ...contactsForSelectQuery(),
    select: ({ core_studentContacts }) =>
      (core_studentContacts || []).map(({ person }) => person),
  });
}
