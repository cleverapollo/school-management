import { PermissionUtils } from '../hooks';
import { UserType } from '../gql/graphql';

export function getPermissionFunctions(usersPermissions: (string | null)[]) {
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

export const isStaffUser = (
  permission: Pick<PermissionUtils, 'userType' | 'tenant'>
) => {
  const { userType, tenant } = permission;
  return (
    !!userType &&
    ([UserType.Admin, UserType.Teacher].includes(userType) ||
      (UserType.Tyro === userType && tenant !== -32))
  );
};

export const isTyroTenantAndUser = (
  permission: Pick<PermissionUtils, 'userType' | 'tenant'>
) => {
  const { userType, tenant } = permission;
  return !!userType && UserType.Tyro === userType && tenant === -32;
};

export const isTyroUser = (permission: Pick<PermissionUtils, 'userType'>) => {
  const { userType } = permission;
  return !!userType && userType === UserType.Tyro;
};

export const isStudent = (permission: Pick<PermissionUtils, 'userType'>) => {
  const { userType } = permission;
  return !!userType && userType === UserType.Student;
};

export const isContact = (permission: Pick<PermissionUtils, 'userType'>) => {
  const { userType } = permission;
  return !!userType && userType === UserType.Contact;
};
