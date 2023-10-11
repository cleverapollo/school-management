import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Core_PeopleFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { usePreferredNameLayout } from '@tyro/core';
import { peopleKeys } from '../keys';

const peopleBasedOnPartyIds = graphql(/* GraphQL */ `
  query core_people($filter: Core_PeopleFilter!) {
    core_people(filter: $filter) {
      partyId
      title {
        id
        name
        nameTextId
      }
      firstName
      lastName
      avatarUrl
      type
    }
  }
`);

const personalTitlesQuery = (filter: Core_PeopleFilter) => ({
  queryKey: peopleKeys.common.basedOnPartyIds(filter),
  queryFn: async () => gqlClient.request(peopleBasedOnPartyIds, { filter }),
});

export function usePeopleBasedOnPartyIds(
  filter: Core_PeopleFilter,
  enabled = true
) {
  const { sortByDisplayName } = usePreferredNameLayout();

  return useQuery({
    ...personalTitlesQuery(filter),
    enabled,
    select: ({ core_people }) => core_people.sort(sortByDisplayName),
  });
}

export type ReturnTypeFromUsePeopleBasedOnPartyIds = UseQueryReturnType<
  typeof usePeopleBasedOnPartyIds
>[number];
