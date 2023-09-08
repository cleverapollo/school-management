import { NonClassContactHoursFilter, StaffFilter } from '@tyro/api';

export const dtrReturnsKeys = {
  all: ['dtrReturns'] as const,
  dtrReturns: (filter: StaffFilter) => [...dtrReturnsKeys.all, filter] as const,
  nonClassContacts: (filter: NonClassContactHoursFilter) =>
    [...dtrReturnsKeys.all, filter] as const,
  formB: () => [...dtrReturnsKeys.all, 'formB'] as const,
};
