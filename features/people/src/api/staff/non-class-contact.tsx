import {
  gqlClient,
  graphql,
  UseQueryReturnType,
  queryClient,
  NonClassContactHoursFilter,
} from '@tyro/api';
import { useQuery } from '@tanstack/react-query';
import { peopleKeys } from '../keys';

export type ReturnTypeFromUseNonClassContactHours = UseQueryReturnType<
  typeof useNonClassContactHours
>[number];

const nonClassContactHours = graphql(/* GraphQL */ `
  query eire_nonClassContactHours($filter: NonClassContactHoursFilter) {
    eire_nonClassContactHours(filter: $filter) {
      academicNameSpaceId
      activity
      dayOfTheWeek
      description
      hours
      minutes
      nonClassContactHoursId
      programme
      staffPartyId
    }
  }
`);

const nonClassContactHoursQuery = (filter: NonClassContactHoursFilter) => ({
  queryKey: peopleKeys.staff.nonClassContacts(filter),
  queryFn: async () => gqlClient.request(nonClassContactHours, { filter }),
});

export function getNonClassContactHours(filter: NonClassContactHoursFilter) {
  return queryClient.fetchQuery(nonClassContactHoursQuery(filter));
}

export function useNonClassContactHours(filter: NonClassContactHoursFilter) {
  return useQuery({
    ...nonClassContactHoursQuery(filter),
    select: ({ eire_nonClassContactHours }) => eire_nonClassContactHours,
  });
}
