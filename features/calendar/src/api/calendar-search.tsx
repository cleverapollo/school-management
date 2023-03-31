import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context } from '@tyro/api';

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
    queryKey: ['calendar-search', query],
    queryFn: async () =>
      gqlClient.request(calendarSearch, {
        filter: { text: trimmedQuery, context: [Context.Calendar] },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => search_search,
  });
}
