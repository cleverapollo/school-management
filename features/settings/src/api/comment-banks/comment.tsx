import { useQuery } from '@tanstack/react-query';
import {
  gqlClient,
  graphql,
  queryClient,
  UseQueryReturnType,
  CommentBankFilter,
} from '@tyro/api';
import { commentBanksKeys } from './keys';

const commentBankById = graphql(/* GraphQL */ `
  query commentBankById($filter: CommentBankFilter) {
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

const commentBankByIdQuery = (filter: CommentBankFilter) => ({
  queryKey: commentBanksKeys.commentBankById(filter),
  queryFn: async () => gqlClient.request(commentBankById, { filter }),
});

export function getCommentBankById(filter: CommentBankFilter) {
  return queryClient.fetchQuery(commentBankByIdQuery(filter));
}

export function useCommentBankById(filter: CommentBankFilter) {
  return useQuery({
    ...commentBankByIdQuery(filter),
    select: ({ assessment_commentBank }) =>
      assessment_commentBank && assessment_commentBank[0]?.comments,
  });
}

export type ReturnTypeFromCommentBankById = UseQueryReturnType<
  typeof useCommentBankById
>[number];
