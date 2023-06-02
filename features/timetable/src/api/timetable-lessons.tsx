import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, UseQueryReturnType } from '@tyro/api';

import { timetableKeys } from './keys';

const timetableLesson = graphql(/* GraphQL */ `
  query asd {
    tt_timetables {
      timetableId
      name
    }
  }
`);

const timeTableLessonQuery = {
  queryKey: timetableKeys.all,
  queryFn: async () => gqlClient.request(timetableLesson),
};

export function getTimetableLesson() {
  return queryClient.fetchQuery(timeTableLessonQuery);
}

export function useTimetableLesson() {
  return useQuery({
    ...timeTableLessonQuery,
    select: ({ tt_timetables }) => {
      if (!Array.isArray(tt_timetables)) return [];
      return tt_timetables;
    },
  });
}

export type ReturnTypeFromUseTimeTableLesson = UseQueryReturnType<
  typeof useTimetableLesson
>[number];
