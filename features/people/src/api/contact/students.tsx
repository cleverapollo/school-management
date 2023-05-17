import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient, Student } from '@tyro/api';
import dayjs from 'dayjs';

const contactsStudentsById = graphql(/* GraphQL */ `
  query core_studentContacts_students($filter: StudentContactFilter!) {
    core_studentContacts(filter: $filter) {
      partyId
      relationships {
        studentPartyId
        relationshipType
        priority
        allowedToContact
        includeInSms
        includeInTmail
        pickupRights
        legalGuardian
        allowAccessToStudentData
        ... on StudentContactRelationshipInfo {
          student {
            partyId
            classGroup {
              name
            }
            ... on Student {
              person {
                firstName
                lastName
                avatarUrl
              }
            }
          }
        }
      }
    }
  }
`);

export const contactStudentsKeys = {
  all: ['people', 'contact', 'students'] as const,
  details: (contactId: number | undefined) =>
    [...contactStudentsKeys.all, 'about', contactId] as const,
};

const contactStudentsQuery = (contactId: number | undefined) => ({
  queryKey: contactStudentsKeys.details(contactId),
  queryFn: async () =>
    gqlClient.request(contactsStudentsById, {
      filter: { studentContactPartyIds: [contactId ?? 0] },
    }),
});

export function getContactStudents(contactId: number | undefined) {
  return queryClient.fetchQuery(contactStudentsQuery(contactId));
}

export function useContactStudents(contactId: number | undefined) {
  return useQuery({
    ...contactStudentsQuery(contactId),
    select: ({ core_studentContacts }) => {
      const [studentContact] = core_studentContacts || [];
      if (!studentContact?.relationships) return null;

      return studentContact?.relationships;
    },
  });
}
