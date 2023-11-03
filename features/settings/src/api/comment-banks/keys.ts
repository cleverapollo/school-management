import { CommentBankFilter } from '@tyro/api';

export const commentBanksKeys = {
  all: ['commentBanks'] as const,
  commentBanks: (filter: CommentBankFilter) =>
    [...commentBanksKeys.all, 'commentBanks', filter] as const,
  commentBankById: (filter: CommentBankFilter) =>
    [...commentBanksKeys.all, 'commentBankById', filter] as const,
};
