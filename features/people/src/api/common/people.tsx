import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Core_PeopleFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { sortByDisplayName } from '@tyro/core';
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
  queryFn: async () => {
    const { core_people: corePeople } = await gqlClient.request(
      peopleBasedOnPartyIds,
      { filter }
    );

    return {
      core_people: corePeople.sort(sortByDisplayName),
    };
  },
});

export function usePeopleBasedOnPartyIds(
  filter: Core_PeopleFilter,
  enabled = true
) {
  return useQuery({
    ...personalTitlesQuery(filter),
    enabled,
    select: ({ core_people }) => core_people,
  });
}

export type ReturnTypeFromUsePeopleBasedOnPartyIds = UseQueryReturnType<
  typeof usePeopleBasedOnPartyIds
>[number];
