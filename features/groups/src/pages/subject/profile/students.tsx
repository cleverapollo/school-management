import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  useNumber,
  TablePersonAvatar,
  ActionMenu,
  ReturnTypeDisplayName,
  usePreferredNameLayout,
  useDisclosure,
} from '@tyro/core';

import { MobileIcon, SendMailIcon } from '@tyro/icons';
import {
  PermissionUtils,
  SubjectGroupStudentMembershipTypeEnum,
  usePermissions,
  UserType,
} from '@tyro/api';
import { Fade, Box } from '@mui/material';

import { useSubjectGroupById } from '../../../api';
import { ManageSubjectGroupMembership } from '../../../components/manage-group-membership-modal';

type ReturnTypeFromUseSubjectGroupById = NonNullable<
  NonNullable<ReturnType<typeof useSubjectGroupById>['data']>['students']
>[number];

const getSubjectGroupsColumns = (
  translate: TFunction<'common'[], undefined, 'common'[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseSubjectGroupById>['columnDefs'] => [
  {
    field: 'person',
    headerName: translate('common:name'),
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroupById>) =>
      data && (
        <TablePersonAvatar
          person={data?.person}
          to={`/people/students/${data?.partyId ?? ''}`}
        />
      ),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    sort: 'asc',
  },
  {
    field: 'classGroup.name',
    headerName: translate('common:classGroup'),
    valueGetter: ({ data }) => data?.classGroup?.name || '-',
    enableRowGroup: true,
  },
];

const canSeeModifyMembership = (
  subjectGroupType: SubjectGroupStudentMembershipTypeEnum | undefined,
  { isStaffUserWithPermission }: PermissionUtils
): boolean => {
  if (subjectGroupType === undefined) {
    return false;
  }
  if (
    isStaffUserWithPermission(
      'ps:1:groups:modify_all_types_subject_group_memberships'
    )
  ) {
    return true;
  }
  if (subjectGroupType === SubjectGroupStudentMembershipTypeEnum.Freeform) {
    return isStaffUserWithPermission(
      'ps:1:groups:modify_all_types_subject_group_memberships'
    );
  }
  return false;
};
export default function SubjectGroupProfileStudentsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const {
    isOpen: isOpenMembership,
    onClose: onCloseMembership,
    onOpen: onOpenMembership,
  } = useDisclosure();
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const [selectedGroups, setSelectedGroups] = useState<
    ReturnTypeFromUseSubjectGroupById[]
  >([]);

  const { userType } = usePermissions();
  const { displayName } = usePreferredNameLayout();

  const isAdminUserType = userType === UserType.Admin;
  const isTeacherUserType = userType === UserType.Teacher;
  const showActionMenu = isAdminUserType || isTeacherUserType;

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayName),
    [t]
  );

  return (
    <>
      <Table
        rowData={subjectGroupData?.students ?? []}
        columnDefs={studentColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.partyId)}
        rightAdornment={
          <>
            {selectedGroups.length > 0 && (
              <Fade in={selectedGroups.length > 0} unmountOnExit>
                <Box>
                  <ActionMenu
                    menuItems={[
                      {
                        label: t('people:sendSms'),
                        icon: <MobileIcon />,
                        hasAccess: () => false,
                        // TODO: add action logic
                        onClick: () => {},
                      },
                      {
                        label: t('mail:sendMail'),
                        icon: <SendMailIcon />,
                        hasAccess: () => false,
                        // TODO: add action logic
                        onClick: () => {},
                      },
                    ]}
                  />
                </Box>
              </Fade>
            )}
            {selectedGroups.length === 0 && (
              <Box>
                <ActionMenu
                  menuItems={[
                    {
                      label: t('groups:updateStudentMembership'),
                      icon: <MobileIcon />,
                      // TODO: add action logic
                      onClick: onOpenMembership,
                      hasAccess: (permissions) =>
                        canSeeModifyMembership(
                          subjectGroupData?.studentMembershipType?.type,
                          permissions
                        ),
                    },
                  ]}
                />
              </Box>
            )}
          </>
        }
        onRowSelection={setSelectedGroups}
      />

      {groupIdNumber && (
        <ManageSubjectGroupMembership
          subjectGroupId={groupIdNumber}
          open={isOpenMembership}
          onClose={() => onCloseMembership()}
        />
      )}
    </>
  );
}
