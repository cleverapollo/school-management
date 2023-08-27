import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  CalendarEventFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { peopleKeys } from '../../keys';

const studentDailyCalendarTimetableInformation = graphql(/* GraphQL */ `
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

const studentDailyCalendarInformationQuery = (filter: CalendarEventFilter) => ({
  queryKey:
    peopleKeys.students.studentDailyCalendarTimetableInformation(filter),
  queryFn: async () => {
    const { calendar_calendarEvents: calendarEvents } = await gqlClient.request(
      studentDailyCalendarTimetableInformation,
      {
        filter,
      }
    );
    const events = calendarEvents?.resources[0]?.events;
    const studentId =
      filter?.resources?.partyIds && filter?.resources?.partyIds[0];

    const filteredEvents = events?.map((event) => ({
      ...event,
      extensions: {
        ...event.extensions,
        eventAttendance: event?.extensions?.eventAttendance?.filter(
          (attendance) => attendance?.personPartyId === studentId
        ),
      },
    }));

    return {
      calendar_calendarEvents: filteredEvents?.sort(
        (a, b) =>
          new Date(a?.startTime).getTime() - new Date(b?.startTime).getTime()
      ),
    };
  },
});

export function getStudentDailyCalendarInformation(
  filter: CalendarEventFilter
) {
  return queryClient.fetchQuery(studentDailyCalendarInformationQuery(filter));
}

export function useStudentDailyCalendarInformation(
  filter: CalendarEventFilter
) {
  return useQuery({
    ...studentDailyCalendarInformationQuery(filter),
    select: ({ calendar_calendarEvents }) => calendar_calendarEvents,
  });
}

export type ReturnTypeFromUseTimetable = UseQueryReturnType<
  typeof useStudentDailyCalendarInformation
>;