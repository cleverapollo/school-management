import { OptionFilter, PreferencesFilter } from '@tyro/api';

export const optionsKeys = {
  all: ['options'] as const,
  setupList: (filter: OptionFilter) =>
    [...optionsKeys.all, 'setupList', filter] as const,
  preferences: (filter: PreferencesFilter) =>
    [...optionsKeys.all, 'preferences', filter] as const,
};
