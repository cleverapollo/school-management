import { useMutation } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { CreateCalendarEventsInput } from '../../../../packages/api/src/gql/graphql';

const createEvents = graphql(/* GraphQL */ `
  mutation calendar_createCalendarEvents($input: CreateCalendarEventsInput!){
    calendar_createCalendarEvents(input: $input){
      eventId
      calendarIds
      schedule{
        startTime
        endTime
        startDate
        endDate
        recurrenceRule
      }
      attendees{
        partyId
        type
        startDate
        endDate
        recurrenceRule
      }
      exclusions{
        partyId
        startDate
        endDate
        recurrenceRule
      }
      type
      lessonInfo{
        subjectGroupId
        lessonId
      }
      roomIds
    }
  }
`);

export function useCreateCalendarEvents(input: CreateCalendarEventsInput) {
  return useMutation({
    mutationKey: ['calendar', 'createCalendarEvents', input],
    mutationFn: async () => gqlClient.request(createEvents, { input: input }),
  });
}
