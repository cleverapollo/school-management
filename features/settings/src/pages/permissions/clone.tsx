import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { MemberType } from '@tyro/api';
import { PermissionForm } from '../../components/permissions/permission-form';
import { usePermissionGroups } from '../../api/permissions/user-permissions-groups';
import { PermissionFormState } from '../../components/permissions/permission-form/types';
import { PermissionContainer } from '../../components/permissions/container';

export default function ClonePermissionPage() {
  const { permissionGroupId } = useParams();
  const groupId = useNumber(permissionGroupId);

  const { data: permissionGroupData = [] } = usePermissionGroups({
    ids: [groupId ?? 0],
  });

  const [groupData] = permissionGroupData;

  const initialState = useMemo<Partial<PermissionFormState>>(() => {
    if (!groupData) return {};

    const { memberType, permissionSets } = groupData;

    return {
      permissionsFieldsBySetId: permissionSets.reduce<
        PermissionFormState['permissionsFieldsBySetId']
      >((permissionsFieldsBySetId, permission) => {
        permissionsFieldsBySetId[permission.id] = permission;

        return permissionsFieldsBySetId;
      }, {}),
      memberType:
        memberType === MemberType.Admin ? MemberType.Staff : memberType,
    };
  }, [permissionGroupData]);

  return (
    <PermissionContainer mode="clone" groupName={groupData?.name}>
      <PermissionForm initialState={initialState} />
    </PermissionContainer>
  );
}
