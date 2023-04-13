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

export const commentBankKey = {
  list: ['assessment', 'commentBank'] as const,
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
