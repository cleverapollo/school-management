import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, CommentBankFilter } from '@tyro/api';

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

export const commentBankKey = {
  list: ['assessment', 'commentBank'] as const,
  listWithComments: (filter: CommentBankFilter) =>
    [...commentBankKey.list, filter] as const,
};

const commentBankQuery = (filter: CommentBankFilter) => ({
  queryKey: commentBankKey.list,
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

export type CommentBankOption = NonNullable<
  NonNullable<ReturnType<typeof useCommentBank>['data']>[number]
>;

const commentBanksWithCommentsQuery = (filter: CommentBankFilter) => ({
  queryKey: commentBankKey.listWithComments(filter),
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
