import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context } from '@tyro/api';
import { peopleCommonKeys } from './keys';

const partySearch = graphql(/* GraphQL */ `
  query calendarSearchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
      avatarUrl
    }
  }
`);

export function usePartySearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: peopleCommonKeys.partySearch(trimmedQuery),
    queryFn: async () =>
      gqlClient.request(partySearch, {
        filter: { text: trimmedQuery, context: [Context.Party] },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => search_search,
  });
}
