import { useNumber, usePreferredNameLayout } from '@tyro/core';
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
  const { sortByDisplayName } = usePreferredNameLayout();

  const { getMembersByMemberType, isLoading } = useMembersByPermissionType();

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
      permissionsFieldsByIds: permissionSets.reduce<
        PermissionFormState['permissionsFieldsByIds']
      >(
        (permissionsByIds, permission) => ({
          ...permissionsByIds,
          [permission.id]: permission,
        }),
        {} as PermissionFormState['permissionsFieldsByIds']
      ),
      memberType,
      ...(custom && {
        id,
        name,
        description,
        members: members
          .filter((member) => memberPartyIds.includes(member.partyId))
          .sort(sortByDisplayName),
      }),
    };
  }, [permissionGroupData, isLoading]);

  return (
    <PermissionContainer>
      <PermissionForm initialState={initialState} />
    </PermissionContainer>
  );
}
