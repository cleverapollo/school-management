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

import { AddNoteIcon, AddUserIcon } from '@tyro/icons';
import {
  getPersonProfileLink,
  PermissionUtils,
  SubjectGroupStudentMembershipTypeEnum,
  usePermissions,
} from '@tyro/api';

import { StudentTableAvatar, CreateBehaviourModal } from '@tyro/people';
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
        <StudentTableAvatar
          person={data?.person}
          isPriorityStudent={!!data?.extensions?.priority}
          hasSupportPlan={false}
          to={getPersonProfileLink(data?.person)}
        />
      ),
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
  const {
    isOpen: isAddBehaviourOpen,
    onClose: onCloseAddBehaviour,
    onOpen: onOpenAddBehaviour,
  } = useDisclosure();
  const { groupId } = useParams();
  const groupIdNumber = useNumber(groupId);

  const { data: subjectGroupData } = useSubjectGroupById(groupIdNumber);

  const [selectedStudents, setSelectedStudents] = useState<
    ReturnTypeFromUseSubjectGroupById[]
  >([]);

  const permissions = usePermissions();
  const { displayName } = usePreferredNameLayout();

  const canModifyMembership = canSeeModifyMembership(
    subjectGroupData?.studentMembershipType?.type,
    permissions
  );
  const showActionMenu =
    permissions.isStaffUser &&
    (selectedStudents.length > 0 || canModifyMembership);

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
        getLocaleText={(params) =>
          params.key === 'totalAndFilteredRows'
            ? t('common:students')
            : params.defaultValue
        }
        statusBar={{
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
          ],
        }}
        rightAdornment={
          showActionMenu && (
            <ActionMenu
              menuItems={
                selectedStudents.length > 0
                  ? [
                      {
                        label: t('people:actions.createBehaviour'),
                        icon: <AddNoteIcon />,
                        hasAccess: ({ isStaffUserWithPermission }) =>
                          isStaffUserWithPermission(
                            'ps:1:notes:write_behaviour'
                          ),
                        onClick: onOpenAddBehaviour,
                      },
                    ]
                  : [
                      {
                        label: t('groups:updateStudentMembership'),
                        icon: <AddUserIcon />,
                        onClick: onOpenMembership,
                        hasAccess: () => canModifyMembership,
                      },
                    ]
              }
            />
          )
        }
        onRowSelection={setSelectedStudents}
      />

      <CreateBehaviourModal
        open={isAddBehaviourOpen}
        onClose={onCloseAddBehaviour}
        initialState={{
          students: selectedStudents.map(({ person }) => person),
          subjects: subjectGroupData ? [subjectGroupData] : [],
        }}
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
