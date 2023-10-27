import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context, SearchType } from '@tyro/api';
import { calendarKeys } from './keys';

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

export function useCalendarSearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: calendarKeys.search(query),
    queryFn: async () =>
      gqlClient.request(calendarSearch, {
        filter: {
          text: trimmedQuery,
          context: [Context.Calendar],
          includeSearchType: [
            SearchType.Student,
            SearchType.Staff,
            SearchType.GeneralGroup,
            SearchType.CustomGroup,
            SearchType.SubjectGroup,
            SearchType.YearGroupEnrollment,
            SearchType.Room,
          ],
        },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => search_search,
  });
}
