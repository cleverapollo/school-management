import { useMemo } from 'react';
import { UserType } from '../gql/graphql';
import {
  getPermissionFunctions,
  isContact,
  isStaffUser,
  isStudent,
  isTyroTenantAndUser,
  isTyroUser,
} from '../utils/permission-utils';
import { findActiveProfile, getUser, useUser } from './use-user';

export interface PermissionUtils {
  permissions: (string | null)[];
  hasPermission: (permission: string) => boolean;
  hasAtLeastOnePermission: (permissions: Array<string>) => boolean;
  hasAllPermissions: (permissions: Array<string>) => boolean;
  userType: UserType | undefined;
  tenant: number | undefined;
  isStaffUser: boolean;
  isTyroTenantAndUser: boolean;
  isTyroUser: boolean;
  isStudent: boolean;
  isContact: boolean;
}

export interface UsePermissionsReturn extends PermissionUtils {
  isLoading: boolean;
}

export async function getPermissionUtils(): Promise<PermissionUtils> {
  const { myAuthDetails } = await getUser();

  if (!myAuthDetails) throw new Error('USER_NOT_FOUND');

  const activeProfile = findActiveProfile(myAuthDetails);
  const usersPermissions = activeProfile?.permissionIds ?? [];

  const userType = activeProfile?.profileType?.userType;
  const tenant = activeProfile?.tenant?.tenant;

  return {
    permissions: usersPermissions,
    ...getPermissionFunctions(usersPermissions),
    userType: activeProfile?.profileType?.userType,
    tenant: activeProfile?.tenant?.tenant,
    isStaffUser: isStaffUser({ userType, tenant }),
    isTyroTenantAndUser: isTyroTenantAndUser({ userType, tenant }),
    isTyroUser: isTyroUser({ userType }),
    isStudent: isStudent({ userType }),
    isContact: isContact({ userType }),
  };
}

export function usePermissions(): UsePermissionsReturn {
  const { activeProfile, isLoading } = useUser();
  const usersPermissions = activeProfile?.permissionIds ?? [];

  const { hasPermission, hasAtLeastOnePermission, hasAllPermissions } = useMemo(
    () => getPermissionFunctions(usersPermissions),
    [usersPermissions]
  );

  const userType = activeProfile?.profileType?.userType;
  const tenant = activeProfile?.tenant?.tenant;

  return {
    isLoading,
    permissions: usersPermissions,
    hasPermission,
    hasAtLeastOnePermission,
    hasAllPermissions,
    userType,
    tenant,
    isStaffUser: isStaffUser({ userType, tenant }),
    isTyroTenantAndUser: isTyroTenantAndUser({ userType, tenant }),
    isTyroUser: isTyroUser({ userType }),
    isStudent: isStudent({ userType }),
    isContact: isContact({ userType }),
  };
}
