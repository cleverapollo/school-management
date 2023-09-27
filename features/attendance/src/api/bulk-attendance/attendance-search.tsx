import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context } from '@tyro/api';
import { attendanceKeys } from '../keys';

const calendarSearch = graphql(/* GraphQL */ `
  query calendarSearchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
      avatarUrl
    }
  }
`);

export function useBulkAttendanceSearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: attendanceKeys.bulkAttendanceSearch(trimmedQuery),
    queryFn: async () =>
      gqlClient.request(calendarSearch, {
        filter: {
          text: trimmedQuery,
          context: [Context.Party],
          includeSearchType: ['SUBJECT_GROUP', 'STUDENT', 'GENERAL_GROUP'],
        },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => search_search,
  });
}
