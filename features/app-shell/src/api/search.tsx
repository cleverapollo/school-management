import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  SearchType,
  Context,
  SearchSource,
} from '@tyro/api';
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
        filter: {
          text: trimmedQuery,
          context: [Context.All],
          source: SearchSource.TopLevel,
          includeSearchType: [
            SearchType.Student,
            SearchType.Staff,
            SearchType.GeneralGroup,
            SearchType.GeneralGroupStudent,
            SearchType.GeneralGroupStaff,
            SearchType.SubjectGroup,
            SearchType.SubjectGroupStudent,
            SearchType.SubjectGroupStaff,
            SearchType.YearGroupEnrollment,
            SearchType.SubjectGroupStaff,
            SearchType.CustomGroup,
            SearchType.Room,
          ],
        },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => ({
      hasResults:
        (Array.isArray(search_search) && search_search?.length > 0) ||
        results?.length > 0,
      people: search_search.filter(
        ({ type }) => type === SearchType.Student || type === SearchType.Staff
      ),
      groups: search_search.filter(
        ({ type }) => type !== SearchType.Student && type !== SearchType.Staff
      ),
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
