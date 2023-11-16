import { useQuery } from '@tanstack/react-query';

import {
  Assessment_OverallCommentsQuery,
  gqlClient,
  graphql,
  OverallCommentsFilter,
  queryClient,
  UseQueryReturnType,
} from '@tyro/api';
import { usePreferredNameLayout } from '@tyro/core';
import { useCallback } from 'react';
import { assessmentsKeys } from './keys';

const overallComments = graphql(/* GraphQL */ `
  query assessment_overallComments($filter: OverallCommentsFilter) {
    assessment_overallComments(filter: $filter) {
      tutorCommentsEntered
      yearHeadCommentsEntered
      principalCommentsEntered
      totalCommentsToEnter
      students {
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
  }
`);

const overallCommentsByYearGroupQuery = (
  academicNamespaceId: number,
  filter: OverallCommentsFilter
) => ({
  queryKey: assessmentsKeys.overallCommentsByYearGroup(
    academicNamespaceId,
    filter
  ),
  queryFn: () => gqlClient.request(overallComments, { filter }),
});

export function getOverallCommentsByYearGroup(
  academicNamespaceId: number,
  filter: OverallCommentsFilter
) {
  return queryClient.fetchQuery(
    overallCommentsByYearGroupQuery(academicNamespaceId, filter)
  );
}

export function useOverallCommentsByYearGroup(
  academicNamespaceId: number,
  filter: OverallCommentsFilter,
  enabled = true
) {
  const { sortByDisplayName } = usePreferredNameLayout();
  return useQuery({
    ...overallCommentsByYearGroupQuery(academicNamespaceId, filter),
    enabled,
    select: useCallback(
      ({ assessment_overallComments }: Assessment_OverallCommentsQuery) => ({
        ...assessment_overallComments,
        students:
          assessment_overallComments?.students?.sort(
            ({ student: studentA }, { student: studentB }) =>
              sortByDisplayName(studentA.person, studentB.person)
          ) ?? [],
      }),
      [sortByDisplayName]
    ),
  });
}

export type ReturnTypeFromUseOverallCommentsByYearGroup = UseQueryReturnType<
  typeof useOverallCommentsByYearGroup
>;
