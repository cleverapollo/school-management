import { useQuery } from '@tanstack/react-query';
import { CodeType, gqlClient, graphql, queryClient } from '@tyro/api';

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
      status {
        sessionAttendance {
          studentPartyId
          name
          status
        }
        currentLocation {
          room {
            roomId
            name
          }
          lesson
          teacher
          currentAttendance {
            attendanceCodeName
            codeType
          }
        }
        priorityStudent
        activeSupportPlan
      }
    }
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
  staleTime: 1000 * 60 * 1,
});

export function getStudent(studentId: number | undefined) {
  return queryClient.fetchQuery(studentQuery(studentId));
}

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
        status: {
          studentPartyId: student?.partyId ?? 0,
          sessionAttendance: [
            {
              studentPartyId: 0,
              name: 'AM',
              status: 'Present',
            },
            {
              studentPartyId: 1,
              name: 'PM',
              status: 'Absent',
            },
          ],
          currentLocation: {
            room: [
              {
                roomId: 0,
                name: 'Room 20B',
              },
            ],
            lesson: 'English H2',
            teacher: 'Mr. Smith',
            currentAttendance: {
              name: 'Present',
              codeType: CodeType.Present,
            },
          },
          priorityStudent: true,
          activeSupportPlan: true,
        },
      };
    },
    enabled: !!studentId,
  });
}
