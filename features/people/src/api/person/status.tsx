import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, queryClient } from '@tyro/api';
import { peopleKeys } from '../keys';

const statusByPartyId = graphql(/* GraphQL */ `
  query personStatus($filter: PersonStatusFilter) {
      composite_personStatus(filter: $filter) {
          partyId
          sessionAttendance {
              name
              status
          }
          currentLocation {
              partyId
              eventId
              room {
                  roomId
                  name
                  capacity
              }
              lesson
              teacher
              currentAttendance {
                  attendanceCodeName
                  codeType
              }
          }
          priorityStudent
          activeSupportPlan
      }
  }
`);
const statusQuery = (partyId: number | undefined) => ({
  queryKey: peopleKeys.students.status(partyId),
  queryFn: async () =>
    gqlClient.request(statusByPartyId, {
      filter: { partyId: partyId || 0 },
    }),
});

export function getPersonStatus(partyId: number | undefined) {
  return queryClient.fetchQuery(statusQuery(partyId));
}

export function usePersonStatus(partyId: number | undefined) {
  return useQuery({
    ...statusQuery(partyId),
    select: ({ composite_personStatus }) => composite_personStatus,
  });
}
