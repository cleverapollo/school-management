import {
  Feature,
  PermissionGroup,
  PermissionGroupPermissionSet,
} from '@tyro/api';

import { MemberOption } from '../../../hooks/use-members-by-permission-type';

export type PermissionFormState = {
  id: PermissionGroup['id'];
  name: PermissionGroup['name'];
  memberType: PermissionGroup['memberType'];
  description: PermissionGroup['description'];
  members: MemberOption[];
  permissionSets: Record<Feature, Array<PermissionGroupPermissionSet>>;
};
