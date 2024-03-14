import { useQuery } from '@tanstack/react-query';
import {
  YearGroupEnrollmentFilter as BEYearGroupEnrollmentFilter,
  graphql,
  gqlClient,
  queryClient,
  UseQueryReturnType,
  EmulateHeaders,
} from '@tyro/api';
import { groupsKeys } from './keys';

export type YearGroupEnrollmentFilter = BEYearGroupEnrollmentFilter & {
  academicNameSpaceId?: number;
};

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

const yearGroupEnrollmentsQuery = (filter: YearGroupEnrollmentFilter) => {
  const { academicNameSpaceId, ...restOfFilter } = filter;
  return {
    queryKey: groupsKeys.year.groupEnrollments(filter),
    queryFn: () =>
      gqlClient.request(
        yearGroupEnrollments,
        { filter: restOfFilter },
        academicNameSpaceId
          ? {
              [EmulateHeaders.ACADEMIC_NAMESPACE_ID]:
                academicNameSpaceId.toString(),
            }
          : {}
      ),
  };
};

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
