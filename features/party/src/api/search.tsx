import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Party,
  PartyFilter,
  PartySearchQuery,
  queryClient,
} from '@tyro/api';
import { sortBy } from 'lodash';

const partySearch = graphql(/* GraphQL */ `
  query partySearch($filter: PartyFilter!) {
    core_parties(filter: $filter) {
      partyId
      __typename
      ... on GeneralGroup {
        name
      }
      ... on SubjectGroup {
        name
      }
      ... on Student {
        person {
          firstName
          lastName
        }
      }
      ... on Staff {
        person {
          firstName
          lastName
        }
      }
    }
  }
`);

/*eslint-disable */
function mapParty(a: any): PartyOption {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (a.__typename === 'Student') {
    return {
        id: a.partyId,
      label: `${a.person.firstName} ${a.person.lastName}`,
      partyType: a.__typename
    } as PartyOption;
  }
  if (a.__typename === 'Staff') {
    return {
        id: a.partyId,
        label: `${a.person.firstName} ${a.person.lastName}`,
        partyType: a.__typename
    } as PartyOption;
  }
  if (a.__typename === 'SubjectGroup') {
    return {
        id: a.partyId,
        label: a.name,
      partyType: a.__typename
    } as PartyOption;
  }

    return {
      id: a.partyId,
        label: a.name,
        partyType: a.__typename
    } as PartyOption;

}
/* eslint-enable */
export interface PartyOption {
  id: number;
  label: string;
  partyType: string;
}

export function usePartySearch(filter: PartyFilter) {
  return useQuery({
    queryKey: ['parties-search', filter],
    queryFn: async () =>
      gqlClient.request(partySearch, {
        filter,
      }),
    keepPreviousData: true,
    select: ({ core_parties }) => {
      const parties = core_parties.map(mapParty).filter((a) => a != null);

      return sortBy(parties, 'partyType', 'label');
    },
  });
}
