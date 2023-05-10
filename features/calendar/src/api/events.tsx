import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  CalendarEventFilter,
  CalendarEventAttendeeType,
  queryClient,
  getColorBasedOnIndex,
  CalendarEventType,
  Calendar_CalendarEventsQuery,
} from '@tyro/api';
import { EventInput } from '@fullcalendar/core';
import { useTheme } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { CalendarEvent, IndividualAttendee } from '../@types/calendar';
import { getResourceName } from '../utils/get-party-name';
import { useTimetableInfo } from './timetable';
import { calendarKeys } from './keys';

const events = graphql(/* GraphQL */ `
  query calendar_calendarEvents($filter: CalendarEventFilter!) {
    calendar_calendarEvents(filter: $filter) {
      resources {
        resourceId
        ... on PartyCalendar {
          __typename
          partyInfo {
            __typename
            ... on PartyGroup {
              name
              avatarUrl
            }
            ... on PartyPerson {
              person {
                avatarUrl
                firstName
                lastName
              }
            }
          }
        }
        ... on RoomCalendar {
          room {
            name
          }
        }
        events {
          name
          eventId
          calendarIds
          startTime
          endTime
          type
          colour
          description
          allDayEvent
          lessonInfo {
            subjectGroupId
            lessonId
          }
          exclusions {
            partyId
            type
          }
          attendees {
            partyId
            type
            partyInfo {
              partyId
              __typename
              ... on PartyGroup {
                name
                avatarUrl
              }
              ... on PartyPerson {
                person {
                  title
                  firstName
                  lastName
                  avatarUrl
                }
              }
            }
          }
          rooms {
            roomId
            name
          }
        }
      }
    }
  }
`);

export interface ExtendedEventInput extends EventInput {
  organizer: string;
  room: string;
  start: string | Date;
  end: string | Date;
  originalEvent: CalendarEvent;
}

type BussinessHoursInput = {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
};

interface CalendarFilter
  extends Pick<CalendarEventFilter, 'calendarIds' | 'resources'> {
  date: Date;
}

const calendarEventsQuery = (filter: CalendarFilter) => {
  const { date, ...rest } = filter;
  const updatedFilter = {
    startDate: dayjs(date)
      .subtract(1, 'month')
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: dayjs(date).add(1, 'month').startOf('month').format('YYYY-MM-DD'),
    ...rest,
  };
  return {
    queryKey: calendarKeys.events(updatedFilter),
    queryFn: async () => gqlClient.request(events, { filter: updatedFilter }),
  };
};

export function getCalendarEvents(filter: CalendarFilter) {
  return queryClient.fetchQuery(calendarEventsQuery(filter));
}

export function useCalendarEvents(
  filter: CalendarFilter,
  visableEventTypes: CalendarEventType[]
) {
  const { displayName } = usePreferredNameLayout();
  const { palette } = useTheme();
  const { data } = useTimetableInfo(
    dayjs(filter.date).subtract(1, 'month').startOf('month'),
    dayjs(filter.date).add(1, 'month').endOf('month')
  );

  const hasPartyIds = Boolean(filter.resources.partyIds?.length);

  return useQuery({
    ...calendarEventsQuery(filter),
    keepPreviousData: hasPartyIds,
    enabled: hasPartyIds,
    select: useCallback(
      ({ calendar_calendarEvents }: Calendar_CalendarEventsQuery) => {
        const { resources } = calendar_calendarEvents ?? { resources: [] };
        const numberOfResources = resources.length;

        const resourceList = resources.map((resource, index) => ({
          id: String(resource.resourceId),
          title: getResourceName(resource, displayName),
          color: numberOfResources > 1 ? getColorBasedOnIndex(index) : null,
        }));

        const businessHours =
          data?.reduce((acc, day) => {
            if (day.date && day.startTime && day.endTime) {
              const date = dayjs(day.date);
              const startOfWeekKey = date.startOf('week').format('YYYY-MM-DD');
              const valueForWeek = acc.get(startOfWeekKey) ?? [];

              acc.set(startOfWeekKey, [
                ...valueForWeek,
                {
                  daysOfWeek: [date.day()],
                  startTime: dayjs(day.startTime).format('HH:mm'),
                  endTime: dayjs(day.endTime).format('HH:mm'),
                },
              ]);
            }

            return acc;
          }, new Map<string, BussinessHoursInput[]>()) ??
          new Map<string, BussinessHoursInput[]>();

        return {
          numberOfResources,
          resources: resourceList,
          businessHours,
          events: resources.reduce<ExtendedEventInput[]>(
            (eventsList, resource) => {
              const { id: resourceId, color: resourceEventColor } =
                resourceList.find(
                  ({ id }) => id === String(resource.resourceId)
                ) ?? { color: null };

              resource.events.forEach((event) => {
                if (!visableEventTypes.includes(event.type)) return; // skip if event type is not visable

                const organizerInfo = event?.attendees?.filter(
                  (attendee) =>
                    attendee?.type === CalendarEventAttendeeType.Organiser
                )[0] as IndividualAttendee;
                const additionalTeachers = event?.attendees?.filter(
                  (attendee) =>
                    attendee?.type === CalendarEventAttendeeType.Additional
                ) as IndividualAttendee[];

                const eventColor =
                  resourceEventColor ?? event.colour ?? 'slate';

                eventsList.push({
                  id: `${resourceId ?? ''}-${event?.eventId}-${
                    event?.startTime ?? ''
                  }-${event?.endTime ?? ''}`,
                  resourceId,
                  title: event?.name ?? '',
                  additionalTeachers,
                  allDay: event?.allDayEvent,
                  start: event?.startTime,
                  end: event?.endTime,
                  color: eventColor,
                  backgroundColor: palette[eventColor][100],
                  borderColor: palette[eventColor][500],
                  organizer:
                    organizerInfo?.partyInfo?.__typename === 'Staff'
                      ? displayName(organizerInfo?.partyInfo?.person)
                      : '',
                  room: event?.rooms?.length ? event.rooms[0]?.name : '',
                  originalEvent: event,
                  // NOTE: enable when BE support edition
                  // editable: event.type !== CalendarEventType.Lesson,
                  editable: false,
                });
              });

              return eventsList;
            },
            []
          ),
        };
      },
      [data, palette, displayName]
    ),
  });
}

// Refactor this hook after backend will be implemented
export function useUpdateCalendarEvents() {
  return { mutate: (input: any) => {} };
}

// Refactor this hook after backend will be implemented
export function useDeleteCalendarEvents() {
  return { mutate: (input: any) => {} };
}
