import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { personalKeys } from './student/personal';

const statusByStudentid = graphql(/* GraphQL */ `
  query q($filter: StudentStatusFilter) {
    composite_studentStatus(filter: $filter) {
      studentPartyId
      #      currentAttendance {
      #        attendanceCodeName
      #        codeType
      #      }
      currentLocation {
        studentPartyId
        eventId
        room {
          roomId
          name
          capacity
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
`);

export const studentKeys = {
  all: ['people', 'student', 'status'] as const,
  details: (studentId: number | undefined) =>
    [...studentKeys.all, studentId] as const,
};

const statusQuery = (studentId: number | undefined) => ({
  queryKey: studentKeys.details(studentId),
  queryFn: async () =>
    gqlClient.request(statusByStudentid, {
      filter: { studentPartyId: studentId || 0 },
    }),
  staleTime: 1000 * 60 * 5,
});

export function getStudentStatus(studentId: number | undefined) {
  return queryClient.fetchQuery(statusQuery(studentId));
}

export function useStudentStatus(studentId: number | undefined) {
  return useQuery({
    ...statusQuery(studentId),
    select: ({ composite_studentStatus }) => composite_studentStatus,
  });
}
