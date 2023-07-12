import { useNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { PermissionForm } from '../../components/permissions/permission-form';
import { usePermissionGroups } from '../../api/permissions/user-permissions-groups';
import { PermissionFormState } from '../../components/permissions/permission-form/types';
import { useMembersByPermissionType } from '../../hooks/use-members-by-permission-type';
import { PermissionContainer } from '../../components/permissions/container';

export default function EditPermissionPage() {
  const { permissionGroupId } = useParams();
  const groupId = useNumber(permissionGroupId);

  const { data: permissionGroupData = [] } = usePermissionGroups({
    ids: [groupId ?? 0],
  });

  const { getMembersByMemberType } = useMembersByPermissionType();

  const initialState = useMemo<Partial<PermissionFormState>>(() => {
    const [groupData] = permissionGroupData;
    if (!groupData) return {};

    const {
      name,
      description,
      memberPartyIds,
      memberType,
      custom,
      permissionSets,
      id,
    } = groupData;
    const members = getMembersByMemberType(memberType);

    return {
      permissionSets: permissionSets.reduce(
        (permissionsByFeature, permission) => {
          if (!permission.feature) return permissionsByFeature;

          permissionsByFeature[permission.feature] ??= [];
          permissionsByFeature[permission.feature].push(permission);

          return permissionsByFeature;
        },
        {} as PermissionFormState['permissionSets']
      ),
      memberType,
      ...(custom && {
        id,
        name,
        description,
        members: members.filter((member) =>
          memberPartyIds.includes(member.partyId)
        ),
      }),
    };
  }, [permissionGroupData]);

  return (
    <PermissionContainer>
      <PermissionForm initialState={initialState} />
    </PermissionContainer>
  );
}
