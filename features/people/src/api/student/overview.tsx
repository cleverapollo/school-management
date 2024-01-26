import { useQuery } from '@tanstack/react-query';
import {
  Core_Student_ContactsQuery,
  UseQueryReturnType,
  gqlClient,
  graphql,
  queryClient,
} from '@tyro/api';
import { useCallback } from 'react';
import { peopleKeys } from '../keys';

export type ReturnTypeFromUseStudentSubjectGroups = UseQueryReturnType<
  typeof useStudentsSubjectGroups
>[number];

const studentsContacts = graphql(/* GraphQL */ `
  query core_student_contacts($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      contacts {
        partyId
        person {
          partyId
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
          priority
          allowedToContact
          includeInSms
          includeInTmail
          pickupRights
          legalGuardian
          allowAccessToStudentData
        }
      }
    }
  }
`);

const studentsSubjectGroups = graphql(/* GraphQL */ `
  query core_subjectGroupStudents($filter: SubjectGroupStudentFilter!) {
    core_subjectGroupStudents(filter: $filter) {
      students {
        examinable
      }
      subjectGroup {
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
          examinable
        }
      }
    }
  }
`);

const studentsContactsQuery = (studentId: number | undefined) => ({
  queryKey: peopleKeys.students.contacts(studentId),
  queryFn: async () =>
    gqlClient.request(studentsContacts, {
      filter: { partyIds: [studentId ?? 0] },
    }),
});

export function getStudentsContacts(studentId: number | undefined) {
  return queryClient.fetchQuery(studentsContactsQuery(studentId));
}

export function useStudentsContacts(
  studentId: number | undefined,
  enabled = true
) {
  return useQuery({
    ...studentsContactsQuery(studentId),
    enabled,
    select: useCallback(({ core_students }: Core_Student_ContactsQuery) => {
      const [contact] = core_students;
      if (!Array.isArray(contact.contacts)) return [];

      return contact.contacts.map(({ relationships, ...restData }) => ({
        ...restData,
        ...relationships?.[0],
      }));
    }, []),
  });
}

const studentsSubjectGroupsQuery = (studentIds: number[]) => ({
  queryKey: peopleKeys.students.subjectGroups(studentIds),
  queryFn: async () => {
    const { core_subjectGroupStudents: studentsData } = await gqlClient.request(
      studentsSubjectGroups,
      {
        filter: { studentPartyIds: studentIds, subjectGroupIds: [] },
      }
    );

    return studentsData
      .flatMap(({ subjectGroup, students }) =>
        subjectGroup ? [{ subjectGroup, students }] : []
      )
      .map(({ students, subjectGroup }) => ({
        ...subjectGroup,
        irePP: {
          level: subjectGroup?.irePP?.level,
          examinable: students?.[0]?.examinable ?? false,
        },
      }))
      .sort((prev, next) => {
        const [prevSubject] = prev?.subjects || [];
        const [nextSubject] = next?.subjects || [];

        return prevSubject?.name.localeCompare(nextSubject?.name);
      });
  },
});

export function getStudentsSubjectGroups(studentIds: number[]) {
  return queryClient.fetchQuery(studentsSubjectGroupsQuery(studentIds));
}

export function useStudentsSubjectGroups(
  studentIds: number[],
  { enabled }: { enabled: boolean } = { enabled: true }
) {
  return useQuery({
    ...studentsSubjectGroupsQuery(studentIds),
    select: (subjectGroups) => subjectGroups,
    enabled,
  });
}

export type ReturnTypeFromUseStudentsContacts = UseQueryReturnType<
  typeof useStudentsContacts
>[number];
