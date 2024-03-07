import { useQuery } from '@tanstack/react-query';
import {
  YearGroupEnrollmentFilter,
  graphql,
  gqlClient,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { groupsKeys } from './keys';

const yearGroupEnrollments = graphql(/* GraphQL */ `
  query yearGroupEnrollments($filter: YearGroupEnrollmentFilter) {
    core_yearGroupEnrollments(filter: $filter) {
      partyId
      name
      students {
        partyId
        person {
          partyId
          firstName
          lastName
        }
        classGroup {
          partyId
          name
        }
      }
    }
  }
`);

const yearGroupEnrollmentsQuery = (filter: YearGroupEnrollmentFilter) => ({
  queryKey: groupsKeys.year.groupEnrollments(filter),
  queryFn: () => gqlClient.request(yearGroupEnrollments, { filter }),
});

export function getYearGroupEnrollments(filter: YearGroupEnrollmentFilter) {
  return queryClient.fetchQuery(yearGroupEnrollmentsQuery(filter));
}

export function useYearGroupEnrollments(
  filter: YearGroupEnrollmentFilter,
  enabled?: boolean
) {
  return useQuery({
    enabled,
    ...yearGroupEnrollmentsQuery(filter),
    select: ({ core_yearGroupEnrollments }) => {
      if (!Array.isArray(core_yearGroupEnrollments)) return [];

      return core_yearGroupEnrollments;
    },
  });
}

export type ReturnTypeFromUseYearGroupEnrollments = UseQueryReturnType<
  typeof useYearGroupEnrollments
>[number];
