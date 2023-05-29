import { EnrollmentIre_BlockEnrollmentFilter } from '@tyro/api';

export const classListManagerKeys = {
  all: ['classListManager'] as const,
  blocksList: () => [...classListManagerKeys.all, 'blocksList'] as const,
  blockMemberships: (filter: EnrollmentIre_BlockEnrollmentFilter) =>
    [...classListManagerKeys.all, 'blockMemberships', filter] as const,
};
