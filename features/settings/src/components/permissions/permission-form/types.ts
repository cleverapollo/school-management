import { MemberType, PermissionGroup, PermissionSet } from '@tyro/api';

import { MemberOption } from '../../../hooks/use-members-by-permission-type';

export type PermissionFormState = {
  id: PermissionGroup['id'];
  name: PermissionGroup['name'];
  memberType: Exclude<MemberType, MemberType.Admin>;
  isMemberTypeAdmin?: boolean;
  description: PermissionGroup['description'];
  custom: PermissionGroup['custom'];
  members: MemberOption[];
  permissionsFieldsBySetId: Record<
    string,
    {
      id: PermissionSet['id'];
      feature?: PermissionSet['feature'];
      toggle?: PermissionSet['toggle'] | null;
      permissionType?: PermissionSet['permissionType'] | null;
    }
  >;
};
