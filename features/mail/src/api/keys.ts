import { LabelFilter, MailFilter, UnreadCountFilter } from '@tyro/api';

export const mailKeys = {
  all: ['mail'] as const,
  list: (filter: MailFilter) => [...mailKeys.all, 'list', filter] as const,
  mail: (filter: MailFilter) => [...mailKeys.all, 'mail', filter] as const,
  labels: (filter: LabelFilter) => [...mailKeys.all, 'labels', filter] as const,
  unreadCount: (filter: UnreadCountFilter) =>
    [...mailKeys.all, 'unreadCount', filter] as const,
  search: (query: string) => [...mailKeys.all, 'search', query] as const,
};
