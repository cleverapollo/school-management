import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  CalendarEventFilter,
  CreateCalendarEventsInput,
  CalendarEventAttendeeType,
  queryClient,
  Calendar_CalendarEventsQuery,
  getColorBasedOnIndex,
  CalendarEventType,
} from '@tyro/api';
import { EventInput } from '@fullcalendar/core';
import { useTheme } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import dayjs from 'dayjs';
import { IndividualAttendee, Participants } from '../@types/calendar';

const createEvents = graphql(/* GraphQL */ `
  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!) {
    calendar_createCalendarEvents(input: $input) {
      eventId
      calendarIds
      schedule {
        startTime
        endTime
        startDate
        endDate
        recurrenceRule
      }
      attendees {
        partyId
        type
        startDate
        endDate
        recurrenceRule
      }
      exclusions {
        partyId
        startDate
        endDate
        recurrenceRule
      }
      type
      lessonInfo {
        subjectGroupId
        lessonId
      }
      roomIds
    }
  }
`);

const events = graphql(/* GraphQL */ `
  query calendar_calendarEvents($filter: CalendarEventFilter!) {
    calendar_calendarEvents(filter: $filter) {
      resources {
        resourceId
        ... on PartyCalendarResource {
          __typename
          partyInfo {
            __typename
            ... on GeneralGroup {
              name
            }
            ... on Person {
              title
              firstName
              lastName
            }
            ... on Staff {
              person {
                title
                firstName
                lastName
              }
            }
            ... on Student {
              person {
                title
                firstName
                lastName
              }
            }
            ... on SubjectGroup {
              name
            }
          }
        }
        ... on RoomCalendarResource {
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
              ... on GeneralGroup {
                name
              }
              ... on SubjectGroup {
                name
                subjects {
                  name
                }
              }
              ... on Person {
                firstName
                lastName
              }
              ... on Staff {
                person {
                  type
                  partyId
                  firstName
                  lastName
                  avatarUrl
                  title
                }
              }
              ... on Student {
                person {
                  type
                  partyId
                  firstName
                  lastName
                  avatarUrl
                  title
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
  participants: Participants[];
  organizer: any;
  room: string;
  start: string | Date;
  end: string | Date;
}

interface CalendarFilter
  extends Pick<CalendarEventFilter, 'calendarIds' | 'partyIds'> {
  date: Date;
}

export const calendarEventsKeys = {
  all: (filter: CalendarEventFilter) =>
    ['calendar', 'calendarEvents', filter] as const,
};

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
    queryKey: calendarEventsKeys.all(updatedFilter),
    queryFn: async () => gqlClient.request(events, { filter: updatedFilter }),
  };
};

export function getCalendarEvents(filter: CalendarFilter) {
  return queryClient.fetchQuery(calendarEventsQuery(filter));
}

function getResourceName(
  resource: NonNullable<
    Calendar_CalendarEventsQuery['calendar_calendarEvents']
  >['resources'][number],
  getDisplayName: ReturnType<typeof usePreferredNameLayout>['displayName']
) {
  if (resource.__typename === 'PartyCalendarResource' && resource.partyInfo) {
    switch (resource.partyInfo.__typename) {
      case 'GeneralGroup':
        return resource.partyInfo.name;
      case 'Person':
        return getDisplayName(resource.partyInfo);
      case 'Staff':
      case 'Student':
        return getDisplayName(resource.partyInfo.person);
      case 'SubjectGroup':
        return resource.partyInfo.name;
      default:
        return '';
    }
  }

  if (resource.__typename === 'RoomCalendarResource' && resource.room) {
    return resource.room.name;
  }

  return '';
}

export function useCalendarEvents(
  filter: CalendarFilter,
  visableEventTypes: CalendarEventType[]
) {
  const { displayName } = usePreferredNameLayout();
  const { palette } = useTheme();

  return useQuery({
    ...calendarEventsQuery(filter),
    keepPreviousData: true,
    select: ({ calendar_calendarEvents }) => {
      const { resources } = calendar_calendarEvents ?? { resources: [] };
      const numberOfResources = resources.length;

      const resourceList = resources.map((resource, index) => ({
        id: String(resource.resourceId),
        title: getResourceName(resource, displayName),
        color: numberOfResources > 1 ? getColorBasedOnIndex(index) : null,
      }));

      return {
        numberOfResources,
        resources: resourceList,
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
              const participants = event?.attendees?.filter(
                (attendee) => attendee?.partyInfo?.__typename === 'Student'
              ) as Participants[];

              const eventColor = resourceEventColor ?? event.colour ?? 'slate';

              eventsList.push({
                id: `${resourceId ?? ''}-${event?.eventId}-${
                  event?.startTime ?? ''
                }-${event?.endTime ?? ''}`,
                resourceId,
                title: event?.name,
                participants,
                additionalTeachers,
                start: event?.startTime,
                end: event?.endTime,
                backgroundColor: palette[eventColor][100],
                borderColor: palette[eventColor][500],
                organizer:
                  organizerInfo?.partyInfo?.__typename === 'Staff'
                    ? displayName(organizerInfo?.partyInfo?.person)
                    : '',
                room: event?.rooms?.length ? event.rooms[0]?.name : '',
              });
            });

            return eventsList;
          },
          []
        ),
      };
    },
  });
}

export function useCreateCalendarEvents() {
  return useMutation({
    mutationKey: ['calendar', 'createCalendarEvents'],
    mutationFn: async (input: CreateCalendarEventsInput) =>
      gqlClient.request(createEvents, { input }),
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
