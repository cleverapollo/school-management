import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  useDisclosure,
  useNumber,
  usePreferredNameLayout,
} from '@tyro/core';

import { AddUserIcon, MobileIcon, SendMailIcon } from '@tyro/icons';
import { usePermissions, UserType, getPersonProfileLink } from '@tyro/api';
import { Box, Fade } from '@mui/material';
import { StudentTableAvatar } from '@tyro/people';
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
      data ? (
        <StudentTableAvatar
          person={data?.person}
          isPriorityStudent={!!data?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.person)}
        />
      ) : null,
    cellClass: 'cell-value-visible',
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
                      icon: <AddUserIcon />,
                      // TODO: add action logic
                      onClick: onOpenMembership,
                      hasAccess: ({ isStaffUserWithPermission }) =>
                        isStaffUserWithPermission(
                          'ps:1:groups:modify_support_group_memberships'
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
