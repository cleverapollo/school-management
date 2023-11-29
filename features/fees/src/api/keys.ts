import { StudentFeeFilter } from '@tyro/api';

export const feeKeys = {
  all: ['fees'] as const,
  studentFees: (filter: StudentFeeFilter) =>
    [...feeKeys.all, 'studentFees', filter] as const,
};
