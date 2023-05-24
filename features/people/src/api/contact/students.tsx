import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleContactsKeys } from './keys';

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

const contactStudentsQuery = (contactId: number | undefined) => ({
  queryKey: peopleContactsKeys.students(contactId),
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
      if (!Array.isArray(core_studentContacts)) return [];
      const [studentContact] = core_studentContacts;

      return studentContact?.relationships ?? [];
    },
  });
}