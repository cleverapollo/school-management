import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  CalendarEvent,
  CalendarEventFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { peopleKeys } from '../../keys';

const timetableInformation = graphql(/* GraphQL */ `
  query calendar_calendarInformation($filter: CalendarEventFilter) {
    calendar_calendarEvents(filter: $filter) {
      resources {
        events {
          eventId
          startTime
          endTime
          type
          lessonInfo {
            subjectGroupId
          }
          colour
          name
          extensions {
            eventAttendance {
              id
              eventId
              attendanceCodeId
              personPartyId
              date
              note
              createdByPartyId
              createdBy {
                partyId
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

const timetableQuery = (filter: CalendarEventFilter) => ({
  queryKey: peopleKeys.students.timetableInformation(filter),
  queryFn: async () => gqlClient.request(timetableInformation, { filter }),
});

export function getTimetable(filter: CalendarEventFilter) {
  return queryClient.fetchQuery(timetableQuery(filter));
}

export function useTimetable(filter: CalendarEventFilter) {
  return useQuery({
    ...timetableQuery(filter),
    select: ({ calendar_calendarEvents }) => {
      const events = calendar_calendarEvents?.resources[0]?.events;
      const studentId =
        filter?.resources?.partyIds && filter?.resources?.partyIds[0];
      const filterExtensionsByPersonPartyId = (
        event: CalendarEvent,
        studentPartyId: number
      ) => ({
        ...event,
        extensions: {
          ...event.extensions,
          eventAttendance: event?.extensions?.eventAttendance?.filter(
            (attendance) => attendance?.personPartyId === studentPartyId
          ),
        },
      });

      const filteredEvents = events?.map((event) =>
        filterExtensionsByPersonPartyId(
          event as CalendarEvent,
          studentId as number
        )
      );

      return filteredEvents;
    },
  });
}

export type ReturnTypeFromUseTimetable = UseQueryReturnType<
  typeof useTimetable
>;
