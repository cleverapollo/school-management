import { useNumber, usePreferredNameLayout } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { MemberType } from '@tyro/api';
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
  const { sortByDisplayName } = usePreferredNameLayout();

  const { getMembersByMemberType, isLoading } = useMembersByPermissionType();

  const [groupData] = permissionGroupData;

  const initialState = useMemo<Partial<PermissionFormState>>(() => {
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
    const isMemberTypeAdmin = memberType === MemberType.Admin;

    return {
      id,
      name,
      description,
      custom,
      memberType: isMemberTypeAdmin ? MemberType.Staff : memberType,
      isMemberTypeAdmin,
      members: members
        .filter((member) => memberPartyIds.includes(member.partyId))
        .sort(sortByDisplayName),
      permissionsFieldsBySetId: permissionSets.reduce<
        PermissionFormState['permissionsFieldsBySetId']
      >((permissionsFieldsBySetId, permission) => {
        permissionsFieldsBySetId[permission.id] = permission;

        return permissionsFieldsBySetId;
      }, {}),
    };
  }, [groupData, isLoading]);

  return (
    <PermissionContainer mode="edit" groupName={groupData?.name}>
      <PermissionForm initialState={initialState} />
    </PermissionContainer>
  );
}
