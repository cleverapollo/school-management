import { EnrollmentIre_BlockEnrollmentFilter } from '@tyro/api';

export const classListManagerKeys = {
  all: ['classListManager'] as const,
  blocksList: () => [...classListManagerKeys.all, 'blocksList'] as const,
  allBlockMemberships: () =>
    [...classListManagerKeys.all, 'blockMemberships'] as const,
  blockMemberships: (filter: EnrollmentIre_BlockEnrollmentFilter) =>
    [
      ...classListManagerKeys.allBlockMemberships(),
      'blockMemberships',
      filter,
    ] as const,
};
