import { Options_OptionFilter, Options_PreferencesFilter } from '@tyro/api';

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
};
