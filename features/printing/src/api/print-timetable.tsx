import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Print_TimetableOptions,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';

const printTimetable = graphql(/* GraphQL */ `
  query printTimetable($filter: Print_TimetableOptions!) {
    print_printTimetable(filter: $filter) {
      url
      html
    }
  }
`);
const printTimetableQuery = (filter: Print_TimetableOptions) => ({
  queryKey: ['print', 'timetable', filter],
  queryFn: async () =>
    gqlClient.request(printTimetable, {
      filter,
    }),
});

export function getPrintTimetable(filter: Print_TimetableOptions) {
  return queryClient.fetchQuery(printTimetableQuery(filter));
}

export function usePrintTimetable(filter: Print_TimetableOptions) {
  return useQuery({
    ...printTimetableQuery(filter),
    select: ({ print_printTimetable }) => print_printTimetable,
  });
}

export type ReturnTypeFromUsePrintTimetable = UseQueryReturnType<
  typeof usePrintTimetable
>;
