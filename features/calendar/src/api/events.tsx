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
  Calendar_TagContext,
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

export const DEFAULT_CALENDAR_TIMES = {
  start: '08:00:00',
  end: '15:00:00',
};

const calendarEvents = graphql(/* GraphQL */ `
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
                  title {
                    id
                    name
                    nameTextId
                  }
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
          tags {
            label
            context
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

type BusinessHoursInput = {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
};

type WeekHours = {
  businessHours: BusinessHoursInput[];
  slotMinTime: string;
  slotMaxTime: string;
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
    queryFn: async () =>
      gqlClient.request(calendarEvents, { filter: updatedFilter }),
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

        const weekHours =
          data?.reduce((acc, day) => {
            if (day.date && day.startTime && day.endTime) {
              const date = dayjs(day.date);
              const startOfWeekKey = date.startOf('week').format('YYYY-MM-DD');
              const valueForWeek = acc.get(startOfWeekKey) ?? {
                businessHours: [],
                slotMinTime: DEFAULT_CALENDAR_TIMES.start,
                slotMaxTime: DEFAULT_CALENDAR_TIMES.end,
              };

              const startTimeForSlot = dayjs(day.startTime)
                .startOf('hour')
                .format('HH:mm:ss');
              const endTimeForSlot = dayjs(day.endTime)
                .endOf('hour')
                .format('HH:mm:ss');

              if (valueForWeek.slotMinTime > startTimeForSlot) {
                valueForWeek.slotMinTime = startTimeForSlot;
              }

              if (valueForWeek.slotMaxTime < endTimeForSlot) {
                valueForWeek.slotMaxTime = endTimeForSlot;
              }

              acc.set(startOfWeekKey, {
                ...valueForWeek,
                businessHours: [
                  ...valueForWeek.businessHours,
                  {
                    daysOfWeek: [date.day()],
                    startTime: dayjs(day.startTime).format('HH:mm'),
                    endTime: dayjs(day.endTime).format('HH:mm'),
                  },
                ],
              });
            }

            return acc;
          }, new Map<string, WeekHours>()) ?? new Map<string, WeekHours>();

        const events = resources.reduce<ExtendedEventInput[]>(
          (eventsList, resource) => {
            const { id: resourceId, color: resourceEventColor } =
              resourceList.find(
                ({ id }) => id === String(resource.resourceId)
              ) ?? { color: null };

            resource.events.forEach((event) => {
              if (!visableEventTypes.includes(event.type)) return; // skip if event type is not visable

              // check if event is outside slotTimes
              if (event.startTime && event.endTime) {
                const startOfWeekDate = dayjs(event.startTime)
                  .startOf('week')
                  .format('YYYY-MM-DD');
                const weekHour = weekHours.get(startOfWeekDate);

                if (weekHour) {
                  const startTimeForSlot = dayjs(event.startTime)
                    .startOf('hour')
                    .format('HH:mm:ss');
                  const endTimeForSlot = dayjs(event.endTime)
                    .endOf('hour')
                    .format('HH:mm:ss');

                  const isOutsideMinSlotTime =
                    weekHour.slotMinTime > startTimeForSlot;
                  const isOutsideMaxSlotTime =
                    weekHour.slotMaxTime < endTimeForSlot;

                  if (isOutsideMinSlotTime) {
                    weekHour.slotMinTime = startTimeForSlot;
                  }

                  if (isOutsideMaxSlotTime) {
                    weekHour.slotMaxTime = endTimeForSlot;
                  }

                  if (isOutsideMinSlotTime || isOutsideMaxSlotTime) {
                    weekHours.set(startOfWeekDate, weekHour);
                  }
                }
              }

              const organizerInfo = event?.attendees?.filter(
                (attendee) =>
                  attendee?.type === CalendarEventAttendeeType.Organiser
              )[0] as IndividualAttendee;
              const additionalTeachers = event?.attendees?.filter(
                (attendee) =>
                  attendee?.type === CalendarEventAttendeeType.Additional
              ) as IndividualAttendee[];

              const eventColor = resourceEventColor ?? event.colour ?? 'slate';

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
                isSubstitution: event.tags.some(
                  (tag) => tag.context === Calendar_TagContext.Substitution
                ),
                originalEvent: event,
                // NOTE: enable when BE support edition
                // editable: event.type !== CalendarEventType.Lesson,
                editable: false,
              });
            });

            return eventsList;
          },
          []
        );

        return {
          numberOfResources,
          resources: resourceList,
          weekHours,
          events,
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
