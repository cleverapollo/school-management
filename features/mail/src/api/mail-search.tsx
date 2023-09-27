import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Context, UseQueryReturnType } from '@tyro/api';
import { mailKeys } from './keys';

const mailSearch = graphql(/* GraphQL */ `
  query mailSearchQuery($filter: SearchFilter) {
    search_search(filter: $filter) {
      partyId
      type
      text
      avatarUrl
    }
  }
`);

export function useMailSearch(query: string) {
  const trimmedQuery = query.trim();

  return useQuery({
    queryKey: mailKeys.search(query),
    queryFn: async () =>
      gqlClient.request(mailSearch, {
        filter: { text: trimmedQuery, context: [Context.Mail] },
      }),
    enabled: trimmedQuery.length > 0,
    keepPreviousData: true,
    select: ({ search_search }) => search_search,
  });
}

export type ReturnTypeUseMailSearch = UseQueryReturnType<
  typeof useMailSearch
>[number];
