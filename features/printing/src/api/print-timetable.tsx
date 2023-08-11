import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Print_TimetableOptions,
  queryClient,
} from '@tyro/api';

const printTimetable = graphql(/* GraphQL */ `
  query printTimetable($filter: Print_TimetableOptions!) {
    print_printTimetable(filter: $filter) {
      uuid
    }
  }
`);
const printTimetableQuery = (filter: Print_TimetableOptions) => ({
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
    select: ({ print_printTimetable }) => print_printTimetable.uuid,
  });
}
