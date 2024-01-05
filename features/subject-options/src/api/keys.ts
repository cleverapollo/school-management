import { OptionFilter } from '@tyro/api';

export const optionsKeys = {
  all: ['options'] as const,
  setupList: (filter: OptionFilter) =>
    [...optionsKeys.all, 'setupList', filter] as const,
};
