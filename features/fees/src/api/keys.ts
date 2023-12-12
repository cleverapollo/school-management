import { DiscountFilter, FeeFilter, StudentFeeFilter } from '@tyro/api';

export const feeKeys = {
  all: ['fees'] as const,
  studentFees: (filter: StudentFeeFilter) =>
    [...feeKeys.all, 'studentFees', filter] as const,
  discounts: (filter: DiscountFilter) =>
    [...feeKeys.all, 'discounts', filter] as const,
  stripeAccount: () => [...feeKeys.all, 'stripeAccount'] as const,
  fees: (filter: FeeFilter) => [...feeKeys.all, 'fees', filter] as const,
};
