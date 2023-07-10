import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  TtResourceTimetableViewFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { timetableKeys } from '../keys';

const timetableResourceView = graphql(/* GraphQL */ `
  query tt_resourceTimetableView($filter: TTResourceTimetableViewFilter!) {
    tt_resourceTimetableView(filter: $filter) {
      timeslots {
        timeslotIds {
          gridIdx
          dayIdx
          periodIdx
        }
        timeslots {
          dayOfWeek
          startTime
          endTime
          periodType
        }
        lessons {
          id {
            lessonIdx
            lessonInstanceIdx
            timetableGroupId
          }
          timeslotId {
            gridIdx
            dayIdx
            periodIdx
          }
          timeslotInfo {
            startTime
            endTime
          }
          partyGroup {
            __typename
            partyId
            name
            avatarUrl
            ... on SubjectGroup {
              subjects {
                name
                colour
              }
            }
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
                nameTextId
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
  }
`);

const timetableResourceViewQuery = (filter: TtResourceTimetableViewFilter) => ({
  queryKey: timetableKeys.resourceView(filter),
  queryFn: () => gqlClient.request(timetableResourceView, { filter }),
});

export function getTimetableResourceView(
  filter: TtResourceTimetableViewFilter
) {
  return queryClient.fetchQuery(timetableResourceViewQuery(filter));
}

export function useTimetableResourceView(
  filter: TtResourceTimetableViewFilter
) {
  return useQuery({
    ...timetableResourceViewQuery(filter),
    enabled:
      (!!filter.partyIds?.length || !!filter.roomIds?.length) &&
      filter.timetableId !== 0,
    keepPreviousData: true,
    select: ({ tt_resourceTimetableView }) =>
      tt_resourceTimetableView.timeslots,
  });
}

export type ReturnTypeFromUseTimetableResourceView = UseQueryReturnType<
  typeof useTimetableResourceView
>;
