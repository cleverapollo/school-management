import { useMemo } from 'react';
import { UserType } from '../gql/graphql';
import { findActiveProfile, getUser, useUser } from './use-user';

export interface PermissionUtils {
  permissions: (string | null)[];
  hasPermission: (permission: string) => boolean;
  hasAtLeastOnePermission: (permissions: Array<string>) => boolean;
  hasAllPermissions: (permissions: Array<string>) => boolean;
  userType: UserType | undefined;
}

export interface UsePermissionsReturn extends PermissionUtils {
  isLoading: boolean;
}

function getPermissionFunctions(usersPermissions: (string | null)[]) {
  return {
    hasPermission: (permission: string) =>
      usersPermissions.includes(permission),
    hasAtLeastOnePermission: (permissions: Array<string>) =>
      permissions.some((permission) =>
        usersPermissions.includes(permission ?? '')
      ),
    hasAllPermissions: (permissions: Array<string>) =>
      permissions.every((permission) =>
        usersPermissions.includes(permission ?? '')
      ),
  };
}

export async function getPermissionUtils(): Promise<PermissionUtils> {
  const { myAuthDetails } = await getUser();

  if (!myAuthDetails) throw new Error('USER_NOT_FOUND');

  const activeProfile = findActiveProfile(myAuthDetails);
  const usersPermissions = activeProfile?.permissionIds ?? [];

  return {
    permissions: usersPermissions,
    ...getPermissionFunctions(usersPermissions),
    userType: activeProfile?.profileType?.userType,
  };
}

export function usePermissions(): UsePermissionsReturn {
  const { activeProfile, isLoading } = useUser();
  const usersPermissions = activeProfile?.permissionIds ?? [];

  const { hasPermission, hasAtLeastOnePermission, hasAllPermissions } = useMemo(
    () => getPermissionFunctions(usersPermissions),
    [usersPermissions]
  );

  return {
    isLoading,
    permissions: usersPermissions,
    hasPermission,
    hasAtLeastOnePermission,
    hasAllPermissions,
    userType: activeProfile?.profileType?.userType,
  };
}
