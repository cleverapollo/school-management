import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleStudentsKeys } from './keys';

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
const statusQuery = (studentId: number | undefined) => ({
  queryKey: peopleStudentsKeys.status(studentId),
  queryFn: async () =>
    gqlClient.request(statusByStudentId, {
      filter: { studentPartyId: studentId || 0 },
    }),
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
