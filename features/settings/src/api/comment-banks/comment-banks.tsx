import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  CommentBankFilter,
} from '@tyro/api';
import { commentBanksKeys } from './keys';

const commentBanks = graphql(/* GraphQL */ `
  query assessment_commentBank($filter: CommentBankFilter) {
    assessment_commentBank(filter: $filter) {
      id
      name
      description
      active
      comments {
        id
        comment
        active
      }
    }
  }
`);

const commentBanksQuery = (filter: CommentBankFilter) => ({
  queryKey: commentBanksKeys.commentBanks(filter),
  queryFn: async () => gqlClient.request(commentBanks, { filter }),
});

export function getCommentBanks(filter: CommentBankFilter) {
  return queryClient.fetchQuery(commentBanksQuery(filter));
}

export function useCommentBanks(filter: CommentBankFilter) {
  return useQuery({
    ...commentBanksQuery(filter),
    select: ({ assessment_commentBank }) => assessment_commentBank,
  });
}

export type ReturnTypeFromCommentBanks = UseQueryReturnType<
  typeof useCommentBanks
>[number];
