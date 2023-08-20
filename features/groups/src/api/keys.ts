import { BlockFilter, CalendarEventIteratorFilter } from '@tyro/api';

export const groupsKeys = {
  all: ['groups'] as const,
  class: {
    all: () => [...groupsKeys.all, 'class'] as const,
    groups: () => [...groupsKeys.class.all(), 'list'] as const,
    details: (id: number | undefined) =>
      [...groupsKeys.class.all(), 'details', id] as const,
  },
  custom: {
    all: () => [...groupsKeys.all, 'custom'] as const,
    groups: () => [...groupsKeys.custom.all(), 'list'] as const,
    details: (id: number | undefined) =>
      [...groupsKeys.custom.all(), 'details', id] as const,
  },
  subject: {
    all: () => [...groupsKeys.all, 'subject'] as const,
    groups: () => [...groupsKeys.subject.all(), 'list'] as const,
    details: (id: number | undefined) =>
      [...groupsKeys.subject.all(), 'details', id] as const,
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
    details: (id: number | undefined) =>
      [...groupsKeys.year.all(), 'details', id] as const,
  },
  blocks: {
    filter: (filter: BlockFilter) => [
      ...groupsKeys.support.all(),
      'blocks',
      filter,
    ],
  },
};
