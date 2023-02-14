import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { useSearchFeatures } from '../hooks/use-search-features';

const omniSearch = graphql(/* GraphQL */ `
  query searchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
    }
  }
`);

export function useOmniSearch(query: string) {
  const pages = useSearchFeatures(query);

  return useQuery({
    queryKey: ['omni-search', query],
    queryFn: async () =>
      gqlClient.request(omniSearch, {
        filter: { text: query },
      }),
    enabled: query.length > 0,
    select: ({ search_search }) => ({
      hasResults:
        (Array.isArray(search_search) && search_search?.length > 0) ||
        pages?.length > 0,
      people: search_search,
      pages,
    }),
  });
}
