import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { CalendarEventFilter } from '../../../../packages/api/src/gql/graphql';
import { COLOR_OPTIONS } from '../components/CalendarForm';
import { EventInput } from '@fullcalendar/common';

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
    }
  }
`);

export function useGetCalendarEvents(filter: CalendarEventFilter) {
  return useQuery({
    queryKey: ['calendar', 'calendarEvents', filter],
    queryFn: async () => gqlClient.request(events, { filter: filter }),
    select: ({ calendar_calendarEvents }) => {
      const newEvents = calendar_calendarEvents?.map((event, index) => {
        //ToDo: refactor this when we get full data from the backend
        const filteredAttendees = event?.attendees?.filter(attendee => attendee?.type === "ATTENDEE")[0];
        const subjects = filteredAttendees?.partyInfo?.__typename === 'SubjectGroup' ? filteredAttendees?.partyInfo?.subjects : [];
        return {
          title: subjects?.length ? subjects[0]?.name : '',
          start: event?.startTime,
          end: event?.endTime,
          //ToDO: get this color from the backend in the future
          backgroundColor: COLOR_OPTIONS[index] || '#00AB55',
        } as EventInput
      });
      return newEvents;
    }
  });
}
