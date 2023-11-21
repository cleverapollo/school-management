import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Print_PersonsGroupMemberships,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';

const printPersonsGroupMemberships = graphql(/* GraphQL */ `
  query printPersonsGroupMemberships($filter: Print_PersonsGroupMemberships!) {
    print_personsGroupMemberships(filter: $filter) {
      url
      html
    }
  }
`);

const printPersonsGroupMembershipsQuery = (
  filter: Print_PersonsGroupMemberships,
  groupKey: string
) => ({
  queryKey: ['print', groupKey, filter],
  queryFn: async () =>
    gqlClient.request(printPersonsGroupMemberships, {
      filter,
    }),
});

export function getPrintPersonsGroupMemberships(
  filter: Print_PersonsGroupMemberships,
  groupKey: string
) {
  return queryClient.fetchQuery(printPersonsGroupMembershipsQuery(filter, groupKey));
}

export function usePrintPersonsGroupMemberships(
  filter: Print_PersonsGroupMemberships,
  groupKey: string
) {
  return useQuery({
    ...printPersonsGroupMembershipsQuery(filter, groupKey),
    select: ({ print_personsGroupMemberships }) => print_personsGroupMemberships,
  });
}

export type ReturnTypeFromUsePrintPersonsGroupMemberships = UseQueryReturnType<
  typeof usePrintPersonsGroupMemberships
>;
