import { PermissionGroupFilter, PermissionSetFilter } from '@tyro/api';

export const permissionsKeys = {
  all: ['permissions'] as const,
  permissionGroups: (filter: PermissionGroupFilter) =>
    [...permissionsKeys.all, 'permissionGroups', filter] as const,
  permissionSets: (filter: PermissionSetFilter) =>
    [...permissionsKeys.all, 'permissionSets', filter] as const,
};
