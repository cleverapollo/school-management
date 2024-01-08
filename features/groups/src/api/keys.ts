import {
  BlockFilter,
  CalendarEventIteratorFilter,
  SubjectGroupFilter,
  Core_CustomGroupDefinitionFilter,
  YearGroupEnrollmentFilter,
  Print_GroupMembers,
} from '@tyro/api';

export const groupsKeys = {
  all: ['groups'] as const,
  print: (filter: Print_GroupMembers) => [...groupsKeys.all, 'print', filter],
  class: {
    all: () => [...groupsKeys.all, 'class'] as const,
    groups: () => [...groupsKeys.class.all(), 'list'] as const,
    details: (id: number | undefined) =>
      [...groupsKeys.class.all(), 'details', id] as const,
  },
  custom: {
    all: () => [...groupsKeys.all, 'custom'] as const,
    groups: () => [...groupsKeys.custom.all(), 'list'] as const,
    studentsSearch: (query: string) =>
      [...groupsKeys.custom.all(), 'search', query] as const,
    details: (id: number | undefined) =>
      [...groupsKeys.custom.all(), 'details', id] as const,
    definition: (filter: Core_CustomGroupDefinitionFilter) =>
      [...groupsKeys.custom.all(), 'definition', filter] as const,
  },
  subject: {
    all: () => [...groupsKeys.all, 'subject'] as const,
    groups: () => [...groupsKeys.subject.all(), 'list'] as const,
    details: (id: number | undefined) =>
      [...groupsKeys.subject.all(), 'details', id] as const,
    detailsByFilter: (filter: SubjectGroupFilter) =>
      [
        ...groupsKeys.subject.all(),
        'detailsByFilter',
        filter.partyIds,
      ] as const,
    lesson: (filter: CalendarEventIteratorFilter) => [
      ...groupsKeys.subject.all(),
      'lesson',
      filter,
    ],
  },
  support: {
    all: () => [...groupsKeys.all, 'support'] as const,
    groups: () => [...groupsKeys.support.all(), 'list'] as const,
    details: (id: number | undefined) =>
      [...groupsKeys.support.all(), 'details', id] as const,
    lesson: (filter: CalendarEventIteratorFilter) => [
      ...groupsKeys.support.all(),
      'lesson',
      filter,
    ],
  },
  year: {
    all: () => [...groupsKeys.all, 'year'] as const,
    groups: () => [...groupsKeys.year.all(), 'list'] as const,
    details: (filter: YearGroupEnrollmentFilter) =>
      [...groupsKeys.year.all(), 'details', filter] as const,
  },
  blocks: {
    filter: (filter: BlockFilter) => [
      ...groupsKeys.support.all(),
      'blocks',
      filter,
    ],
  },
};
