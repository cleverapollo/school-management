import { useMutation, useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  CalendarEventFilter,
  CreateCalendarEventsInput,
  CalendarEventAttendeeType,
  queryClient,
  Calendar_CalendarEventsQuery,
} from '@tyro/api';
import { EventInput } from '@fullcalendar/core';
import { useTheme } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { COLOR_OPTIONS, Participant } from '../components/common/calendar/form';

export interface ExtendedEventInput extends EventInput {
  teacherTitle: string;
  participants: Participant[];
  organizer: any;
  room: string;
}

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
          eventId
          calendarIds
          startTime
          endTime
          type
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

export const calendarEventsKeys = {
  all: (filter: CalendarEventFilter) =>
    ['calendar', 'calendarEvents', filter] as const,
};

const calendarEventsQuery = (filter: CalendarEventFilter) => ({
  queryKey: calendarEventsKeys.all(filter),
  queryFn: async () => gqlClient.request(events, { filter }),
});

export function getCalendarEvents(filter: CalendarEventFilter) {
  return queryClient.fetchQuery(calendarEventsQuery(filter));
}

function getResourceName(
  resource: NonNullable<
    Calendar_CalendarEventsQuery['calendar_calendarEvents']
  >['resources'][number],
  getDisplayName: ReturnType<typeof usePreferredNameLayout>['displayName']
) {
  console.log(resource);
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

export function useCalendarEvents(filter: CalendarEventFilter) {
  const { displayName } = usePreferredNameLayout();
  const { palette } = useTheme();

  return useQuery({
    ...calendarEventsQuery(filter),
    select: ({ calendar_calendarEvents }) => {
      const { resources } = calendar_calendarEvents ?? { resources: [] };
      const numberOfResources = resources.length;

      const resourceList = resources.map((resource, index) => {
        const indexColorShift =
          index % 2 === 0
            ? index
            : index + Math.floor(COLOR_OPTIONS.length / 2);

        return {
          id: String(resource.resourceId),
          title: getResourceName(resource, displayName),
          color:
            numberOfResources > 0
              ? COLOR_OPTIONS[indexColorShift % COLOR_OPTIONS.length]
              : null,
        };
      });

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
              const filteredAttendees = event?.attendees?.filter(
                (attendee) =>
                  attendee?.type === CalendarEventAttendeeType.Attendee
              )[0];
              const subjects =
                filteredAttendees?.partyInfo?.__typename === 'SubjectGroup'
                  ? filteredAttendees?.partyInfo?.subjects
                  : [];
              const teacherTitle =
                filteredAttendees?.partyInfo?.__typename === 'SubjectGroup'
                  ? filteredAttendees?.partyInfo?.name
                  : '';
              const participants = event?.attendees?.filter(
                (attendee) =>
                  attendee?.type !== CalendarEventAttendeeType.Attendee
              );
              const organizerInfo = event?.attendees?.filter(
                (attendee) =>
                  attendee?.type === CalendarEventAttendeeType.Organiser
              )[0];

              const eventColor = resourceEventColor ?? 'slate'; // Update to get color from the backend when resourceEventColor is null

              eventsList.push({
                id: `${resourceId ?? ''}-${event?.eventId}-${
                  event?.startTime ?? ''
                }-${event?.endTime ?? ''}`,
                resourceId,
                title: subjects?.length ? subjects[0]?.name : '',
                teacherTitle,
                participants: [], // Figure out wtf is going on with above participants
                start: event?.startTime ?? undefined,
                end: event?.endTime ?? undefined,
                backgroundColor: palette[eventColor][100],
                borderColor: palette[eventColor][500],
                organizer:
                  organizerInfo?.partyInfo?.__typename === 'Person'
                    ? displayName(organizerInfo?.partyInfo)
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
