import { Swm_StaffAbsenceFilter, Swm_StaffAbsenceTypeFilter } from '@tyro/api';

export const substitutionKeys = {
  all: ['substitution'] as const,
  absences: (filter: Swm_StaffAbsenceFilter) =>
    [...substitutionKeys.all, 'absences', filter] as const,
  absenceTypes: (filter: Swm_StaffAbsenceTypeFilter) =>
    [...substitutionKeys.all, 'absenceTypes', filter] as const,
};
