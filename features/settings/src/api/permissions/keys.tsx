import { PermissionGroupFilter } from '@tyro/api';

export const permissionsKeys = {
  all: ['permissions'] as const,
  permissionGroups: (filter: PermissionGroupFilter) =>
    [...permissionsKeys.all, filter] as const,
};
