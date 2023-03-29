import { PermissionUtils } from '../hooks';
import { UserType } from '../gql/graphql';

export const isStaffUser = (permission: PermissionUtils) => {
  const { userType, tenant } = permission;
  return (
    !!userType &&
    ([UserType.Admin, UserType.Teacher].includes(userType) ||
      (UserType.Tyro === userType && tenant !== -32))
  );
};

export const isTyroTenantAndUser = (permission: PermissionUtils) => {
  const { userType, tenant } = permission;
  console.log('----------');
  console.log(permission);
  return !!userType && UserType.Tyro === userType && tenant === -32;
};
