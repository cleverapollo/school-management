import { useCallback } from 'react';
import { useUser } from './use-user';

export function usePermissions() {
  const { activeProfile } = useUser();
  const usersPermissions = activeProfile?.permissionIds ?? [];

  const hasPermission = useCallback(
    (permission: string) => usersPermissions.includes(permission),
    [usersPermissions]
  );

  const hasAtLeastOnePermission = useCallback(
    (permissions: Array<string>) =>
      permissions.some((permission) =>
        usersPermissions.includes(permission ?? '')
      ),
    [usersPermissions]
  );

  const hasAllPermissions = useCallback(
    (permissions: Array<string>) =>
      permissions.every((permission) =>
        usersPermissions.includes(permission ?? '')
      ),
    [usersPermissions]
  );

  return {
    hasPermission,
    hasAtLeastOnePermission,
    hasAllPermissions,
  };
}
