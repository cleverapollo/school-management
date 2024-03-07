import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  TtTimetableListFilter,
  UseQueryReturnType,
} from '@tyro/api';

import { timetableKeys } from '../keys';

const timetables = graphql(/* GraphQL */ `
  query tt_timetables($filter: TTTimetableListFilter) {
    tt_timetables(filter: $filter) {
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

const timeTablesQuery = (filter: TtTimetableListFilter) => ({
  queryKey: timetableKeys.timetableList(filter),
  queryFn: async () => gqlClient.request(timetables, { filter }),
});

export function getTimetables(filter: TtTimetableListFilter) {
  return queryClient.fetchQuery(timeTablesQuery(filter));
}

export function useTimetables(filter: TtTimetableListFilter) {
  return useQuery({
    ...timeTablesQuery(filter),
    select: ({ tt_timetables }) => {
      if (!Array.isArray(tt_timetables)) return [];
      return tt_timetables;
    },
  });
}

export type ReturnTypeFromUseTimeTables = UseQueryReturnType<
  typeof useTimetables
>[number];
