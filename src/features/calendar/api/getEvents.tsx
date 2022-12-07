import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { COLOR_OPTIONS, Participant } from '../components/CalendarForm';
import { EventInput } from '@fullcalendar/common';
import { CalendarEventFilter, CalendarEventType, CreateCalendarEventsInput, CalendarEventAttendeeType } from '@tyro/api/src/gql/graphql';

export interface ExtendedEventInput extends EventInput {
  teacherTitle: string;
  participants: Participant[];
  organizer: any;
  room: string;
}

const events = graphql(/* GraphQL */ `
  query calendar_calendarEvents($filter: CalendarEventFilter!){
    calendar_calendarEvents(filter: $filter){
      calendarIds
      startTime
      endTime
      type
      lessonInfo{
        subjectGroupId
        lessonId
      }
      exclusions{
        partyId
        type
      }
      attendees{
        partyId
        type
        partyInfo{
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
      rooms{
        roomId
        name
      }
    }
  }
`);

export function useCalendarEvents(filter: CalendarEventFilter) {
  return useQuery({
    queryKey: ['calendar', 'calendarEvents', filter],
    queryFn: async () => gqlClient.request(events, { filter: filter }),
    select: ({ calendar_calendarEvents }) => {
      const newEvents = calendar_calendarEvents?.map((event, index) => {
        //ToDo: refactor this when we get full data from the backend
        const filteredAttendees = event?.attendees?.filter(attendee => attendee?.type === CalendarEventAttendeeType.Attendee)[0];
        const subjects = filteredAttendees?.partyInfo?.__typename === 'SubjectGroup' ? filteredAttendees?.partyInfo?.subjects : [];
        const teacherTitle = filteredAttendees?.partyInfo?.__typename === 'SubjectGroup' ? filteredAttendees?.partyInfo?.name : '';
        const participants = event?.attendees?.filter(attendee => attendee?.type !== CalendarEventAttendeeType.Attendee);
        const organizerInfo = event?.attendees?.filter(attendee => attendee?.type === CalendarEventAttendeeType.Organiser)[0];
        return {
          title: subjects?.length ? subjects[0]?.name : '',
          teacherTitle,
          participants,
          start: event?.startTime,
          end: event?.endTime,
          //ToDO: get this color from the backend in the future
          backgroundColor: COLOR_OPTIONS[index] || '#00AB55',
          organizer: organizerInfo?.partyInfo?.__typename === 'Person' ? organizerInfo.partyInfo.firstName + ' ' + organizerInfo.partyInfo.lastName : '',
          room: event?.rooms?.length && event.rooms[0]?.name,
        } as ExtendedEventInput
      });
      return newEvents;
    }
  });
}
