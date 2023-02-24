import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql } from '@tyro/api';
import { useSearchFeatures } from '../hooks/use-search-features';

const omniSearch = graphql(/* GraphQL */ `
  query searchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
      avatarUrl
      meta {
        studentPartyId
      }
    }
  }
`);

export function useOmniSearch(query: string) {
  const trimmedQuery = query.trim();
  const { results } = useSearchFeatures(trimmedQuery);

  return useQuery({
    queryKey: ['omni-search', query],
    queryFn: async () =>
      gqlClient.request(omniSearch, {
        filter: { text: trimmedQuery },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => ({
      hasResults:
        (Array.isArray(search_search) && search_search?.length > 0) ||
        results?.length > 0,
      people: search_search,
      pages: results.map(({ item: { path, icon, title, breadcrumbs } }) => ({
        partyId: path,
        type: 'PAGE' as const,
        text: title,
        meta: {
          path,
          icon,
          breadcrumbs,
        },
      })),
    }),
  });
}
