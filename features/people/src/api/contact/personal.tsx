import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleContactsKeys } from './keys';

const contactsPersonalById = graphql(/* GraphQL */ `
  query core_studentContacts_personal($filter: StudentContactFilter!) {
    core_studentContacts(filter: $filter) {
      partyId
      person {
        title {
          id
          name
          nameTextId
        }
        avatarUrl
        firstName
        lastName
      }
      personalInformation {
        firstName
        lastName
        preferredFirstName
        middleName
        gender
        dateOfBirth
        ire {
          ppsNumber
          religion
          countryOfBirth
        }
        nationality
        mothersMaidenName
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
          areaCode
          countryCode
        }
        phoneNumbers {
          primaryPhoneNumber
          number
          areaCode
          countryCode
        }
        primaryEmail {
          email
        }
      }
      occupation
      requiresInterpreter
      spokenLanguages
    }
  }
`);

const contactPersonalQuery = (contactId: number | undefined) => ({
  queryKey: peopleContactsKeys.personalDetails(contactId),
  queryFn: async () =>
    gqlClient.request(contactsPersonalById, {
      filter: { studentContactPartyIds: [contactId ?? 0] },
    }),
});

export function getContactPersonal(contactId: number | undefined) {
  return queryClient.fetchQuery(contactPersonalQuery(contactId));
}

export function useContactPersonal(contactId: number | undefined) {
  return useQuery({
    ...contactPersonalQuery(contactId),
    select: ({ core_studentContacts }) => {
      const [contact] = core_studentContacts || [];

      return contact;
    },
  });
}
