import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  TtTimetableFilter,
  UseQueryReturnType,
} from '@tyro/api';

import { timetableKeys } from './keys';

const timetables = graphql(/* GraphQL */ `
  query tt_timetables($filter: TTTimetableFilter) {
    tt_timetables(filter: $filter) {
      timetableId
      name
    }
  }
`);

const timeTablesQuery = (filter: TtTimetableFilter) => ({
  queryKey: timetableKeys.timetableList(filter),
  queryFn: async () => gqlClient.request(timetables, { filter }),
});

export function getTimetables(filter: TtTimetableFilter) {
  return queryClient.fetchQuery(timeTablesQuery(filter));
}

export function useTimetables(filter: TtTimetableFilter) {
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
