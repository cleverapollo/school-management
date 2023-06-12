import { StaffFilter } from '@tyro/api';

export const peopleStaffKeys = {
  all: ['peopleStaff'] as const,
  details: (filter: StaffFilter) => [...peopleStaffKeys.all, filter] as const,
  forSelect: (filter: StaffFilter) =>
    [...peopleStaffKeys.all, 'select', filter] as const,
  status: (staffId: number | undefined) =>
    [...peopleStaffKeys.all, 'status', staffId] as const,
  subjectGroups: (filter: StaffFilter) =>
    [...peopleStaffKeys.all, 'classes', filter] as const,
  upsertStaff: () => [...peopleStaffKeys.all, 'upsertStaff'] as const,
  personalDetails: (filter: StaffFilter) =>
    [...peopleStaffKeys.all, 'personal', filter] as const,
  employmentCapacities: () =>
    [...peopleStaffKeys.all, 'employmentCapacities'] as const,
  staffPosts: () => [...peopleStaffKeys.all, 'staffPosts'] as const,
};
