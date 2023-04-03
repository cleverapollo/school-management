import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';

const statusByStudentId = graphql(/* GraphQL */ `
  query q($filter: StudentStatusFilter) {
    composite_studentStatus(filter: $filter) {
      studentPartyId
      sessionAttendance {
        name
        status
      }
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

export const statusKeys = {
  all: ['people', 'student', 'status'] as const,
  details: (studentId: number | undefined) =>
    [...statusKeys.all, studentId] as const,
};

const statusQuery = (studentId: number | undefined) => ({
  queryKey: statusKeys.details(studentId),
  queryFn: async () =>
    gqlClient.request(statusByStudentId, {
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
