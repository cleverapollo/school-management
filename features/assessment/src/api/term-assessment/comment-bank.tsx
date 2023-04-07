import { useQuery } from '@tanstack/react-query';

import { gqlClient, graphql, queryClient, CommentBankFilter } from '@tyro/api';

const commentBank = graphql(/* GraphQL */ `
  query commentBank($filter: CommentBankFilter) {
    commentBank(filter: $filter) {
      id
      name
    }
  }
`);

export const commentBankKey = {
  list: ['termAssessment', 'commentBank'] as const,
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
    select: ({ commentBank: commentBankResponse }) => {
      if (!Array.isArray(commentBankResponse)) return [];

      return commentBankResponse;
    },
  });
}
