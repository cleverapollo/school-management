import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  EventAttendanceFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { peopleKeys } from '../../keys';

const studentEventAttendance = graphql(/* GraphQL */ `
  query attendance_eventAttendance($filter: EventAttendanceFilter) {
    attendance_eventAttendance(filter: $filter) {
      id
      eventId
      attendanceCodeId
      personPartyId
      date
    }
  }
`);

const eventAttendanceQuery = (filter: EventAttendanceFilter) => ({
  queryKey: peopleKeys.students.eventAttendance(filter),
  queryFn: async () =>
    gqlClient.request(studentEventAttendance, {
      filter,
    }),
});

export function getEventAttendanceQuery(filter: EventAttendanceFilter) {
  return queryClient.fetchQuery(eventAttendanceQuery(filter));
}

export function useEventAttendanceQuery(filter: EventAttendanceFilter) {
  return useQuery({
    ...eventAttendanceQuery(filter),
    select: ({ attendance_eventAttendance }) => attendance_eventAttendance,
  });
}

export type EventAttendanceQuery = UseQueryReturnType<
  typeof eventAttendanceQuery
>;
