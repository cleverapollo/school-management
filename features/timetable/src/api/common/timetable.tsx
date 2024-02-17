import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, TtTimetableFilter } from '@tyro/api';

import { timetableKeys } from '../keys';

const timetable = graphql(/* GraphQL */ `
  query tt_timetable($filter: TTTimetableFilter) {
    tt_timetable(filter: $filter) {
      timetableId
      name
      created
      updatedAt
      liveStatus {
        totalChanges
        lessonChanges
        timetableGroupChanges
        lastPublishedDate
      }
    }
  }
`);

const timeTableQuery = (filter: TtTimetableFilter) => ({
  queryKey: timetableKeys.timetable(filter),
  queryFn: async () => {
    const { tt_timetable: ttTimetable } = await gqlClient.request(timetable, {
      filter,
    });
    return ttTimetable;
  },
});

export async function getTimetable(filter: TtTimetableFilter) {
  return queryClient.fetchQuery(timeTableQuery(filter));
}

export function useTimetable(filter: TtTimetableFilter) {
  return useQuery({
    ...timeTableQuery(filter),
  });
}
