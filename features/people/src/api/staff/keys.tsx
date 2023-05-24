import { StaffFilter } from '@tyro/api';

export const peopleStaffKeys = {
  all: ['peopleStaff'] as const,
  details: (filter: StaffFilter) => [...peopleStaffKeys.all, filter] as const,
  forSelect: (filter: StaffFilter) =>
    [...peopleStaffKeys.all, 'select', filter] as const,
  status: (staffId: number | undefined) =>
    [...peopleStaffKeys.all, 'status', staffId] as const,
};