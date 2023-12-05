import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Print_PersonsGroupMemberships,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { peopleKeys } from '../keys';

const printPersonsGroupMemberships = graphql(/* GraphQL */ `
  query printPersonsGroupMemberships($filter: Print_PersonsGroupMemberships!) {
    print_personsGroupMemberships(filter: $filter) {
      url
      html
    }
  }
`);

const printPersonsGroupMembershipsQuery = (
  filter: Print_PersonsGroupMemberships
) => ({
  queryKey: peopleKeys.print(filter),
  queryFn: async () =>
    gqlClient.request(printPersonsGroupMemberships, {
      filter,
    }),
});

export function getPrintPersonsGroupMemberships(
  filter: Print_PersonsGroupMemberships
) {
  return queryClient.fetchQuery(printPersonsGroupMembershipsQuery(filter));
}

export function usePrintPersonsGroupMemberships(
  filter: Print_PersonsGroupMemberships
) {
  return useQuery({
    ...printPersonsGroupMembershipsQuery(filter),
    select: ({ print_personsGroupMemberships }) =>
      print_personsGroupMemberships,
  });
}

export type ReturnTypeFromUsePrintPersonsGroupMemberships = UseQueryReturnType<
  typeof usePrintPersonsGroupMemberships
>;
