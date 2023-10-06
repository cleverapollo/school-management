import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context, SearchType } from '@tyro/api';
import { timetableKeys } from './keys';

const timetableSearch = graphql(/* GraphQL */ `
  query timetableSearchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
      avatarUrl
    }
  }
`);

export function useTimetableSearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: timetableKeys.search(query),
    queryFn: async () =>
      gqlClient.request(timetableSearch, {
        filter: {
          text: trimmedQuery,
          context: [Context.Calendar],
          includeSearchType: [
            SearchType.Student,
            SearchType.Staff,
            SearchType.GeneralGroup,
            SearchType.SubjectGroup,
            SearchType.YearGroupEnrollment,
            SearchType.CustomGroup,
            SearchType.Room,
          ],
        },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => search_search,
  });
}
