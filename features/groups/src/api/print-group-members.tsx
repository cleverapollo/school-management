import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Print_GroupMembers,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';

const printGroupMembers = graphql(/* GraphQL */ `
  query printGroupMembers($filter: Print_GroupMembers!) {
    print_groupMembers(filter: $filter) {
      url
      html
    }
  }
`);
const printGroupMembersQuery = (filter: Print_GroupMembers) => ({
  queryKey: ['print', 'group-members', filter],
  queryFn: async () =>
    gqlClient.request(printGroupMembers, {
      filter,
    }),
});

export function getPrintGroupMembers(filter: Print_GroupMembers) {
  return queryClient.fetchQuery(printGroupMembersQuery(filter));
}

export function usePrintGroupMembers(filter: Print_GroupMembers) {
  return useQuery({
    ...printGroupMembersQuery(filter),
    select: ({ print_groupMembers }) => print_groupMembers,
  });
}

export type ReturnTypeFromUsePrintGroupMembers = UseQueryReturnType<
  typeof usePrintGroupMembers
>;
