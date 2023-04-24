import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, CommentBankFilter } from '@tyro/api';
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

export function useCommentBank(filter: CommentBankFilter) {
  return useQuery({
    ...commentBankQuery(filter),
    select: ({ assessment_commentBank }) => {
      if (!Array.isArray(assessment_commentBank)) return [];

      return assessment_commentBank;
    },
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

export function useCommentBanksWithComments(filter: CommentBankFilter) {
  return useQuery({
    ...commentBanksWithCommentsQuery(filter),
    select: ({ assessment_commentBank }) => assessment_commentBank ?? [],
  });
}
