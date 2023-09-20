import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  Swm_SubstitutionLookupFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { usePreferredNameLayout } from '@tyro/core';
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
          extensions {
            timetableSummary {
              fulltimePeriods
            }
            substitutionSummary {
              substitutionCountThisWeek
              substitutionTimeThisWeekMinutes
              substitutionCountThisYear
              substitutionTimeThisYearMinutes
            }
          }
        }
        available
        clashingEvents
        substitutionStats {
          sandsWeekCount
          sandsWeekMinutes
          sandsYearCount
          sandsYearMinutes
          casualWeekCount
          casualWeekMinutes
        }
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
  const { sortByDisplayName } = usePreferredNameLayout();
  return useQuery({
    ...coverLookupQuery(filter),
    enabled,
    select: ({ swm_substitutionLookup }) => swm_substitutionLookup,
  });
}

export type ReturnTypeFromUseCoverLookup = UseQueryReturnType<
  typeof useCoverLookup
>;
