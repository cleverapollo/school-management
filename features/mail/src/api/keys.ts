import { LabelFilter, MailFilter, UnreadCountFilter } from '@tyro/api';

export const mailKeys = {
  all: ['mail'] as const,
  lists: () => [...mailKeys.all, 'lists'] as const,
  filteredList: (filter: MailFilter) => [...mailKeys.lists(), filter] as const,
  mail: (filter: MailFilter) => [...mailKeys.all, 'mail', filter] as const,
  labels: (filter: LabelFilter) => [...mailKeys.all, 'labels', filter] as const,
  unreadCounts: () => [...mailKeys.all, 'unreadCounts'] as const,
  filteredUnreadCount: (filter: UnreadCountFilter) =>
    [...mailKeys.unreadCounts(), filter] as const,
  search: (query: string) => [...mailKeys.all, 'search', query] as const,
};
