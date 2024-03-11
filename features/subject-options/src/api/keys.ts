import {
  Options_OptionFilter,
  Options_PreferencesFilter,
  Options_OptionIdFilter,
  Options_AvailableGroupsFilter,
  Options_ClmFilter,
} from '@tyro/api';

export const optionsKeys = {
  all: ['options'] as const,
  setupList: (filter: Options_OptionFilter) =>
    [...optionsKeys.all, 'setupList', filter] as const,
  setup: (filter: Options_OptionFilter) =>
    [...optionsKeys.all, 'setup', filter] as const,
  preferences: (filter: Options_PreferencesFilter) =>
    [...optionsKeys.all, 'preferences', filter] as const,
  solveBlocks: (filter: Options_OptionFilter) =>
    [...optionsKeys.all, 'solveBlocks', filter] as const,
  subjectStats: (filter: Options_OptionFilter) =>
    [...optionsKeys.all, 'subjectStats', filter] as const,
  studentAssignment: (filter: Options_OptionFilter) =>
    [...optionsKeys.all, 'studentAssignment', filter] as const,
  solutions: (filter: Options_OptionIdFilter) =>
    [...optionsKeys.all, 'solutions', filter] as const,
  availableEnrollmentGroups: (filter: Options_AvailableGroupsFilter) =>
    [...optionsKeys.all, 'availableEnrollmentGroups', filter] as const,
  enrollmentGroupsStudents: (filter: Options_AvailableGroupsFilter) =>
    [...optionsKeys.all, 'enrollmentGroupsStudents', filter] as const,
  solverInput: (filter: Options_OptionIdFilter) =>
    [...optionsKeys.all, 'solverInput', filter] as const,
  classLists: (filter: Options_ClmFilter) =>
    [...optionsKeys.all, 'classLists', filter] as const,
};
