import {
  BlockFilter,
  EnrollmentIre_BlockEnrollmentFilter,
  EnrollmentIre_CoreEnrollmentFilter,
} from '@tyro/api';

export const classListManagerKeys = {
  all: ['classListManager'] as const,
  blocksList: (filter: BlockFilter) =>
    [...classListManagerKeys.all, 'blocksList', filter] as const,
  allBlockMemberships: () =>
    [...classListManagerKeys.all, 'blockMemberships'] as const,
  blockMemberships: (filter: EnrollmentIre_BlockEnrollmentFilter) =>
    [...classListManagerKeys.allBlockMemberships(), filter] as const,
  allClassMemberships: () =>
    [...classListManagerKeys.all, 'classMemberships'] as const,
  classMemberships: (filter: EnrollmentIre_CoreEnrollmentFilter) =>
    [...classListManagerKeys.allClassMemberships(), filter] as const,
  createOrUpdateBlockRotation: () =>
    [...classListManagerKeys.all, 'createOrUpdateBlockRotation'] as const,
};
