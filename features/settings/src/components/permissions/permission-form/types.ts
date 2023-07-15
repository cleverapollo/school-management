import { PermissionGroup, PermissionSet } from '@tyro/api';

import { MemberOption } from '../../../hooks/use-members-by-permission-type';

export type PermissionFormState = {
  id: PermissionGroup['id'];
  name: PermissionGroup['name'];
  memberType: PermissionGroup['memberType'];
  description: PermissionGroup['description'];
  members: MemberOption[];
  permissionsFieldsByIds: Array<{
    id: PermissionSet['id'];
    feature?: PermissionSet['feature'];
    toggle?: PermissionSet['toggle'] | null;
    permissionType?: PermissionSet['permissionType'] | null;
  }>;
};
