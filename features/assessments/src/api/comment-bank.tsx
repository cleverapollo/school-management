import { useQuery } from '@tanstack/react-query';

import {
  gqlClient,
  graphql,
  queryClient,
  CommentBankFilter,
  UseQueryReturnType,
  CommentBanksWithCommentsQuery,
} from '@tyro/api';
import { useCallback } from 'react';
import { assessmentsKeys } from './keys';

const commentBank = graphql(/* GraphQL */ `
  query commentBankAssessment($filter: CommentBankFilter) {
    assessment_commentBank(filter: $filter) {
      id
      name
    }
  }
`);

const commentBanksWithComments = graphql(/* GraphQL */ `
  query commentBanksWithComments($filter: CommentBankFilter) {
    assessment_commentBank(filter: $filter) {
      id
      name
      comments {
        id
        comment
        active
      }
    }
  }
`);

const commentBankQuery = (filter: CommentBankFilter) => ({
  queryKey: assessmentsKeys.commentBanks(),
  queryFn: () => gqlClient.request(commentBank, { filter }),
});

export function getCommentBank(filter: CommentBankFilter) {
  return queryClient.fetchQuery(commentBankQuery(filter));
}

export function useCommentBank(filter: CommentBankFilter, enabled = true) {
  return useQuery({
    ...commentBankQuery(filter),
    enabled,
    select: ({ assessment_commentBank }) => assessment_commentBank ?? [],
  });
}

export type CommentBankOption = UseQueryReturnType<
  typeof useCommentBank
>[number];

const commentBanksWithCommentsQuery = (filter: CommentBankFilter) => ({
  queryKey: assessmentsKeys.commentBanksWithComments(filter),
  queryFn: () => gqlClient.request(commentBanksWithComments, { filter }),
});

export function getCommentBanksWithComments(filter: CommentBankFilter) {
  return queryClient.fetchQuery(commentBanksWithCommentsQuery(filter));
}

export function useCommentBanksWithComments(
  filter: CommentBankFilter,
  enabled = true
) {
  return useQuery({
    ...commentBanksWithCommentsQuery(filter),
    enabled,
    select: useCallback(
      ({ assessment_commentBank }: CommentBanksWithCommentsQuery) =>
        assessment_commentBank ?? [],
      []
    ),
  });
}
