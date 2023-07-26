import { UserAccessFilter } from '@tyro/api';

export const userAccessKeys = {
  all: ['userAccess'] as const,
  userAccess: (filter: UserAccessFilter) =>
    [...userAccessKeys.all, filter] as const,
  inviteUsers: () => [...userAccessKeys.all, 'inviteUsers'] as const,
  studentContacts: () => [...userAccessKeys.all, 'studentContacts'] as const,
};
