import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context } from '@tyro/api';
import { attendanceKeys } from './keys';

const sessionPartySearch = graphql(/* GraphQL */ `
  query sessionPartySearchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
      avatarUrl
    }
  }
`);

export function useSessionPartySearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: attendanceKeys.sessionPartySearch(trimmedQuery),
    queryFn: async () =>
      gqlClient.request(sessionPartySearch, {
        filter: { text: trimmedQuery, context: [Context.SessionAttendance] },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => search_search,
  });
}
