import { StaffFilter } from '@tyro/api';

export const dtrReturnsKeys = {
  all: ['dtrReturns'] as const,
  dtrReturns: (filter: StaffFilter) => [...dtrReturnsKeys.all, filter] as const,
  formB: () => [...dtrReturnsKeys.all, 'formB'] as const,
};
