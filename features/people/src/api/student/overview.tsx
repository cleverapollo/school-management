import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

const studentsContacts = graphql(/* GraphQL */ `
  query core_student_contacts($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      contacts {
        partyId
        person {
          firstName
          lastName
          avatarUrl
          type
        }
        personalInformation {
          gender
          nationality
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
        relationships {
          relationshipType
          primaryContact
          allowedToContact
        }
      }
    }
  }
`);

const studentsSubjectGroups = graphql(/* GraphQL */ `
  query core_student_subjectGroups($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      subjectGroups {
        partyId
        name
        avatarUrl
        subjects {
          name
          colour
        }
        staff {
          firstName
          lastName
          avatarUrl
        }
        irePP {
          level
        }
      }
    }
  }
`);

export const overviewKeys = {
  all: ['people', 'student', 'overview'] as const,
  contacts: (studentId: number | undefined) =>
    [...overviewKeys.all, 'contacts', studentId] as const,
  subjectGroups: (studentId: number | undefined) =>
    [...overviewKeys.all, 'classes', studentId] as const,
};

const studentsContactsQuery = (studentId: number | undefined) => ({
  queryKey: overviewKeys.contacts(studentId),
  queryFn: async () =>
    gqlClient.request(studentsContacts, {
      filter: { partyIds: [studentId ?? 0] },
    }),
});

export function getStudentsContacts(studentId: number | undefined) {
  return queryClient.fetchQuery(studentsContactsQuery(studentId));
}

export function useStudentsContacts(studentId: number | undefined) {
  return useQuery({
    ...studentsContactsQuery(studentId),
    select: ({ core_students }) =>
      Array.isArray(core_students) && core_students.length > 0
        ? core_students[0]?.contacts ?? []
        : [],
  });
}

const studentsSubjectGroupsQuery = (studentId: number | undefined) => ({
  queryKey: overviewKeys.subjectGroups(studentId),
  queryFn: async () =>
    gqlClient.request(studentsSubjectGroups, {
      filter: { partyIds: [studentId ?? 0] },
    }),
});

export function getStudentsSubjectGroups(studentId: number | undefined) {
  return queryClient.fetchQuery(studentsSubjectGroupsQuery(studentId));
}

export function useStudentsSubjectGroups(studentId: number | undefined) {
  return useQuery({
    ...studentsSubjectGroupsQuery(studentId),
    select: ({ core_students }) =>
      Array.isArray(core_students) && core_students.length > 0
        ? core_students[0]?.subjectGroups ?? []
        : [],
  });
}
