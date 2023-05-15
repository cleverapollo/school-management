import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import dayjs from 'dayjs';

const contactsPersonalById = graphql(/* GraphQL */ `
  query core_studentContacts_personal($filter: StudentContactFilter!) {
    core_studentContacts(filter: $filter) {
      partyId
      person {
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
        primaryEmail {
          email
        }
      }
      occupation
      nativeLanguage
      requiresInterpreter
    }
  }
`);

export const contactPersonalKeys = {
  all: ['people', 'contact', 'personal'] as const,
  details: (contactId: number | undefined) =>
    [...contactPersonalKeys.all, 'about', contactId] as const,
};

const contactPersonalQuery = (contactId: number | undefined) => ({
  queryKey: contactPersonalKeys.details(contactId),
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
      if (!contact) return null;

      const { personalInformation, ...restContact } = contact;

      return {
        ...restContact,
        personalInformation: {
          ...personalInformation,
          dateOfBirth: personalInformation?.dateOfBirth
            ? dayjs(personalInformation.dateOfBirth)
            : null,
        },
      };
    },
  });
}
