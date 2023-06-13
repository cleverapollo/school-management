import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, TtResourceTimetableViewFilter } from '@tyro/api';
import { timetableKeys } from './keys';

const timetableResourceView = graphql(/* GraphQL */ `
  query tt_resourceTimetableView($filter: TTResourceTimetableViewFilter!) {
    tt_resourceTimetableView(filter: $filter) {
      timeslotIds {
        gridIdx
        dayIdx
        periodIdx
      }
      timeslots {
        dayOfWeek
        startTime
        endTime
      }
      lessons {
        id {
          lessonIdx
          lessonInstanceIdx
          timetableGroupId
        }
        partyGroup {
          partyId
          name
          avatarUrl
        }
        room {
          roomId
          name
        }
        teachers {
          person {
            partyId
            title {
              id
              name
            }
            firstName
            lastName
            avatarUrl
            type
          }
        }
        spread
      }
    }
  }
`);

const timetableResourceViewQuery = (filter: TtResourceTimetableViewFilter) => ({
  queryKey: timetableKeys.resourceView(filter),
  queryFn: () => gqlClient.request(timetableResourceView, { filter }),
});

export function useTimetableResourceView(
  filter: TtResourceTimetableViewFilter
) {
  return useQuery({
    ...timetableResourceViewQuery(filter),
    enabled: !!filter.partyIds?.length || !!filter.roomIds?.length,
    select: ({ tt_resourceTimetableView }) => tt_resourceTimetableView,
  });
}
