import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  TtTimetableFilter,
  UseQueryReturnType,
} from '@tyro/api';

import { timetableKeys } from '../keys';

const timetables = graphql(/* GraphQL */ `
  query tt_timetables($filter: TTTimetableFilter) {
    tt_timetables(filter: $filter) {
      timetableId
      name
      liveStatus {
        totalChanges
        lessonChanges
        timetableGroupChanges
        lastPublishedDate
      }
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

export async function getLiveTimetableId() {
  const { tt_timetables: ttTimetables } = await getTimetables({
    liveTimetable: true,
  });
  return ttTimetables?.[0]?.timetableId ?? 0;
}

export function useLiveTimetableId() {
  return useQuery({
    ...timeTablesQuery({ liveTimetable: true }),
    select: ({ tt_timetables }) => tt_timetables?.[0]?.timetableId ?? 0,
  });
}

export type ReturnTypeFromUseTimeTables = UseQueryReturnType<
  typeof useTimetables
>[number];
