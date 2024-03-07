import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  StudentContactFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { sortByDisplayName } from '@tyro/core';
import { peopleKeys } from '../keys';

const contacts = graphql(/* GraphQL */ `
  query core_studentContacts($filter: StudentContactFilter!) {
    core_studentContacts(filter: $filter) {
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
        allowedToContact
        includeInSms
      }
    }
  }
`);

const contactsInfoForSelect = graphql(/* GraphQL */ `
  query core_studentContactsForSelect($filter: StudentContactFilter!) {
    core_studentContacts(filter: $filter) {
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
      personalInformation {
        primaryEmail {
          email
        }
      }
    }
  }
`);

const contactsQuery = (filter: StudentContactFilter) => ({
  queryKey: peopleKeys.contacts.list(filter),
  queryFn: async () => gqlClient.request(contacts, { filter }),
});

export function getContacts(filter: StudentContactFilter) {
  return queryClient.fetchQuery(contactsQuery(filter));
}

export function useContacts(filter: StudentContactFilter) {
  return useQuery({
    ...contactsQuery(filter),
    select: ({ core_studentContacts }) => core_studentContacts,
  });
}

const contactsForSelectQuery = (filter: StudentContactFilter) => ({
  queryKey: peopleKeys.contacts.forSelect(filter),
  queryFn: async () => {
    const { core_studentContacts: contactsData } = await gqlClient.request(
      contactsInfoForSelect,
      { filter }
    );

    return {
      core_studentContacts: (contactsData || [])
        .map(({ person, personalInformation }) => ({
          ...person,
          personalInformation,
        }))
        .sort(sortByDisplayName),
    };
  },
});

export function getContactsForSelect(filter: StudentContactFilter) {
  return queryClient.fetchQuery(contactsForSelectQuery(filter));
}

export function useContactsForSelect(filter: StudentContactFilter) {
  return useQuery({
    ...contactsForSelectQuery(filter),
    select: ({ core_studentContacts }) => core_studentContacts,
  });
}

export type ReturnTypeFromUseContacts = UseQueryReturnType<
  typeof useContacts
>[number];

export type ReturnTypeFromUseContactsForSelect = UseQueryReturnType<
  typeof useContactsForSelect
>[number];
