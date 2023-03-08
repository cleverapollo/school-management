import { useMutation, useQuery } from '@tanstack/react-query';
import {
  AttendanceCodeType,
  gqlClient,
  graphql,
  queryClient,
  Student,
  UpdateStudentInput,
} from '@tyro/api';
import { BulkEditedRows } from '@tyro/core';

const students = graphql(/* GraphQL */ `
  query core_students {
    core_students {
      partyId
      person {
        avatarUrl
        firstName
        lastName
      }
      classGroup {
        name
        staff {
          firstName
          lastName
        }
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
      studentIrePP {
        examNumber
      }
      tutors {
        partyId
        firstName
        lastName
        avatarUrl
      }
      yearGroupLeads {
        partyId
        firstName
        lastName
        avatarUrl
      }
      yearGroups {
        name
      }
      programmeStages {
        name
        programme {
          name
        }
      }
    }
  }
`);

const studentById = graphql(/* GraphQL */ `
  query core_student($filter: StudentFilter!) {
    core_students(filter: $filter) {
      partyId
      person {
        avatarUrl
        firstName
        lastName
      }
      classGroup {
        name
        staff {
          firstName
          lastName
        }
      }
      yearGroupLeads {
        firstName
        lastName
        avatarUrl
      }
      yearGroups {
        shortName
      }
      tutors {
        partyId
        firstName
        lastName
        avatarUrl
        type
      }
    }
  }
`);

const bulkUpdateCoreStudent = graphql(/* GraphQL */ `
  mutation updateCoreStudents($input: [UpdateStudentInput]!) {
    core_updateStudents(input: $input)
  }
`);

export const studentKeys = {
  all: ['people', 'students'] as const,
  details: (studentId: number | undefined) =>
    [...studentKeys.all, studentId] as const,
};

const studentsQuery = {
  queryKey: studentKeys.all,
  queryFn: async () => gqlClient.request(students),
};

export function getStudents() {
  return queryClient.fetchQuery(studentsQuery);
}

export function useStudents() {
  return useQuery({
    ...studentsQuery,
    select: ({ core_students }) => core_students,
  });
}

const studentQuery = (studentId: number | undefined) => ({
  queryKey: studentKeys.details(studentId),
  queryFn: async () =>
    gqlClient.request(studentById, {
      filter: { partyIds: [studentId ?? 0] },
    }),
});

export function getStudent(studentId: number | undefined) {
  return queryClient.fetchQuery(studentQuery(studentId));
}

export type ReturnTypeFromUseStudent = NonNullable<
  ReturnType<typeof useStudent>['data']
>;

export function useStudent(studentId: number | undefined) {
  return useQuery({
    ...studentQuery(studentId),
    select: ({ core_students }) => {
      const student =
        Array.isArray(core_students) && core_students.length > 0
          ? core_students[0]
          : null;
      // Adding mock data for demo purposes
      return {
        ...student,
      };
    },
    enabled: !!studentId,
  });
}

const studentBulkUpdateMapping = {
  'personalInformation.preferredFirstName': 'preferredName',
  'personalInformation.primaryPhoneNumber.number': 'primaryPhoneNumber',
  'personalInformation.primaryEmail.email': 'primaryEmail',
  'studentIrePP.examNumber': 'examNumber',
} as const;

export function useBulkUpdateCoreStudent() {
  return useMutation(
    (input: BulkEditedRows) => {
      const mappedInput = Object.entries(input).map(([partyId, changes]) =>
        Object.entries(changes).reduce<UpdateStudentInput>(
          (acc, [key, { newValue }]) => {
            const mappedKey =
              studentBulkUpdateMapping[
                key as keyof typeof studentBulkUpdateMapping
              ];

            if (mappedKey) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              acc[mappedKey] = newValue;
            }

            return acc;
          },
          { studentPartyId: Number(partyId) }
        )
      );

      return gqlClient.request(bulkUpdateCoreStudent, { input: mappedInput });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(studentKeys.all);
      },
    }
  );
}
