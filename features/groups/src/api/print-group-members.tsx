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

const printGroupMembersQuery = (
  filter: Print_GroupMembers,
  groupKey: string
) => ({
  queryKey: ['print', groupKey, filter],
  queryFn: async () =>
    gqlClient.request(printGroupMembers, {
      filter,
    }),
});

export function getPrintGroupMembers(
  filter: Print_GroupMembers,
  groupKey: string
) {
  return queryClient.fetchQuery(printGroupMembersQuery(filter, groupKey));
}

export function usePrintGroupMembers(
  filter: Print_GroupMembers,
  groupKey: string
) {
  return useQuery({
    ...printGroupMembersQuery(filter, groupKey),
    select: ({ print_groupMembers }) => print_groupMembers,
  });
}

export type ReturnTypeFromUsePrintGroupMembers = UseQueryReturnType<
  typeof usePrintGroupMembers
>;
