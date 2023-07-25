import { useQuery } from '@tanstack/react-query';
import { gqlClient, graphql, Swm_SubstitutionLookupFilter } from '@tyro/api';
import { substitutionKeys } from './keys';

const coverLookup = graphql(/* GraphQL */ `
  query swm_substitutionLookup($filter: SWM_SubstitutionLookupFilter) {
    swm_substitutionLookup(filter: $filter) {
      staff {
        staff {
          person {
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
        available
        clashingEvents
      }
      freeRooms {
        roomId
        name
        pools
      }
      clashingRooms {
        room {
          roomId
          name
          pools
        }
        clash
      }
    }
  }
`);

const coverLookupQuery = (filter: Swm_SubstitutionLookupFilter) => ({
  queryKey: substitutionKeys.coverLookup(filter),
  queryFn: () => gqlClient.request(coverLookup, { filter }),
});

export function useCoverLookup(
  filter: Swm_SubstitutionLookupFilter,
  enabled = true
) {
  return useQuery({
    ...coverLookupQuery(filter),
    enabled,
    select: ({ swm_substitutionLookup }) => swm_substitutionLookup,
  });
}
