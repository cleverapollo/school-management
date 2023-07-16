import { StaffFilter } from '@tyro/api';

export const dtrReturnsKeys = {
  formB: (filter: StaffFilter) => ['dtrReturns', 'formB', filter] as const,
};
