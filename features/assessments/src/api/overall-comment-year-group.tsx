import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  YearGroupStudentFilter,
} from '@tyro/api';
import { usePreferredNameLayout } from '@tyro/core';
import { assessmentsKeys } from './keys';

const overallCommentsByYearGroup = graphql(/* GraphQL */ `
  query assessment_yearGroupStudents($filter: YearGroupStudentFilter) {
    assessment_yearGroupStudents(filter: $filter) {
      studentPartyId
      student {
        person {
          partyId
          firstName
          lastName
          avatarUrl
        }
      }
      commentStatus
      principalComment
      yearHeadComment
      tutorComment
    }
  }
`);

const overallCommentsByYearGroupQuery = (
  academicNamespaceId: number,
  filter: YearGroupStudentFilter
) => ({
  queryKey: assessmentsKeys.overallCommentsByYearGroup(
    academicNamespaceId,
    filter
  ),
  queryFn: () => gqlClient.request(overallCommentsByYearGroup, { filter }),
});

export function getOverallCommentsByYearGroup(
  academicNamespaceId: number,
  filter: YearGroupStudentFilter
) {
  return queryClient.fetchQuery(
    overallCommentsByYearGroupQuery(academicNamespaceId, filter)
  );
}

export function useOverallCommentsByYearGroup(
  academicNamespaceId: number,
  filter: YearGroupStudentFilter,
  enabled = true
) {
  const { sortByDisplayName } = usePreferredNameLayout();
  return useQuery({
    ...overallCommentsByYearGroupQuery(academicNamespaceId, filter),
    enabled,
    select: ({ assessment_yearGroupStudents }) =>
      assessment_yearGroupStudents.sort(
        ({ student: studentA }, { student: studentB }) =>
          sortByDisplayName(studentA.person, studentB.person)
      ) ?? [],
  });
}

export type ReturnTypeFromUseOverallCommentsByYearGroup = UseQueryReturnType<
  typeof useOverallCommentsByYearGroup
>[number];
