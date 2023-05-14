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

export const personalKeys = {
  all: ['people', 'contact', 'personal'] as const,
  details: (contactId: number | undefined) =>
    [...personalKeys.all, 'about', contactId] as const,
};

const contactPersonalQuery = (contactId: number | undefined) => ({
  queryKey: personalKeys.details(contactId),
  queryFn: async () =>
    gqlClient.request(contactsPersonalById, {
      filter: { studentContactPartyIds: [contactId ?? 0] },
    }),
  staleTime: 1000 * 60 * 5,
});

export function getContactPersonal(contactId: number | undefined) {
  return queryClient.fetchQuery(contactPersonalQuery(contactId));
}

export function useContactPersonal(contactId: number | undefined) {
  return useQuery({
    ...contactPersonalQuery(contactId),
    select: ({ core_studentContacts }) => {
      const student =
        Array.isArray(core_studentContacts) && core_studentContacts.length > 0
          ? core_studentContacts[0]
          : null;

      if (!student) return null;

      return {
        ...student,
        personalInformation: {
          ...student.personalInformation,
          dateOfBirth: student?.personalInformation?.dateOfBirth
            ? dayjs(student.personalInformation.dateOfBirth)
            : null,
        },
      };
    },
  });
}
