import {
  Swm_EventsForSubstitutionFilter,
  Swm_StaffAbsenceFilter,
  Swm_StaffAbsenceTypeFilter,
  Swm_StaffSubstitutionTypeFilter,
  Swm_SubstitutionLookupFilter,
} from '@tyro/api';

export const substitutionKeys = {
  all: ['substitution'] as const,
  absences: (filter: Swm_StaffAbsenceFilter) =>
    [...substitutionKeys.all, 'absences', filter] as const,
  absenceTypes: (filter: Swm_StaffAbsenceTypeFilter) =>
    [...substitutionKeys.all, 'absenceTypes', filter] as const,
  eventsForCover: (filter: Swm_EventsForSubstitutionFilter) =>
    [...substitutionKeys.all, 'eventsForCover', filter] as const,
  coverLookup: (filter: Swm_SubstitutionLookupFilter) =>
    [...substitutionKeys.all, 'coverLookup', filter] as const,
  substitutionTypes: (filter: Swm_StaffSubstitutionTypeFilter) =>
    [...substitutionKeys.all, 'substitutionTypes', filter] as const,
};
