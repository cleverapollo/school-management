import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  Swm_EventsForSubstitutionFilter,
  UseQueryReturnType,
} from '@tyro/api';
import { substitutionKeys } from './keys';

const eventsForCover = graphql(/* GraphQL */ `
  query swm_eventsForSubstitutionsByStaffByPeriod(
    $filter: SWM_EventsForSubstitutionFilter
  ) {
    swm_eventsForSubstitutionsByStaffByPeriod(filter: $filter) {
      eventsByStaff {
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
        substitutionEventsByDay {
          dayInfo {
            date
            startTime
            endTime
            dayType
            periods {
              startTime
              endTime
              type
            }
          }
          substitutionEventsByPeriod {
            absenceId
            staffPartyId
            event {
              eventId
              startTime
              endTime
              type
              allDayEvent
              rooms {
                name
                roomId
              }
              tags {
                label
                context
                display
              }
              colour
              name
              description
            }
            substitution {
              originalStaff {
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
              substituteStaff {
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
              substitutionType {
                name
                description
                code
              }
              substituteRoom {
                name
                roomId
              }
              note
            }
          }
        }
      }
    }
  }
`);

const eventsForCoverQuery = (filter: Swm_EventsForSubstitutionFilter) => ({
  queryKey: substitutionKeys.eventsForCover(filter),
  queryFn: () => gqlClient.request(eventsForCover, { filter }),
});

export function getEventsForCover(filter: Swm_EventsForSubstitutionFilter) {
  return queryClient.fetchQuery(eventsForCoverQuery(filter));
}

export function useEventsForCover(
  filter: Swm_EventsForSubstitutionFilter,
  enabled = true
) {
  return useQuery({
    ...eventsForCoverQuery(filter),
    enabled,
    select: ({ swm_eventsForSubstitutionsByStaffByPeriod }) =>
      swm_eventsForSubstitutionsByStaffByPeriod?.eventsByStaff ?? [],
  });
}

export type ReturnTypeFromUseEventsForCover = UseQueryReturnType<
  typeof useEventsForCover
>;
