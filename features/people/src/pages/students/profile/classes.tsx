import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableStudyLevelChip,
  StudyLevelSelectCellEditor,
  TableAvatar,
  getNumber,
  ActionMenu,
  ActionMenuProps,
  useDisclosure,
  TableSwitch,
  TableBooleanValue,
  BulkEditedRows,
} from '@tyro/core';

import set from 'lodash/set';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { Box, Fade } from '@mui/material';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import {
  Core_UpdateStudentSubjectGroupInput,
  PermissionUtils,
  RecipientSearchType,
  SmsRecipientType,
  usePermissions,
} from '@tyro/api';
import { useMailSettings } from '@tyro/mail';
import { useStudentsSubjectGroups } from '../../../api/student/overview';
import { useUpdateStudentSubjectGroup } from '../../../api/student/update-student-subject-group';

type ReturnTypeFromUseStudentsSubjectGroups = NonNullable<
  ReturnType<typeof useStudentsSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames,
  permissions: PermissionUtils
): GridOptions<ReturnTypeFromUseStudentsSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: permissions.isStaffUser,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups>) => {
      if (!data) return null;

      const subject = data?.subjects?.[0];
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};
      const link = permissions.isStaffUserWithPermission(
        'ps:1:groups:view_subject_groups'
      )
        ? `/groups/subject/${data?.partyId ?? ''}`
        : null;
      return (
        <TableAvatar
          name={data?.name ?? ''}
          to={link}
          avatarUrl={data?.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
              ...bgColorStyle,
            },
          }}
        />
      );
    },
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
    enableRowGroup: true,
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    editable: permissions.isStaffUserWithPermission(
      'ps:1:people:student_write'
    ),
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups, any>) =>
      data?.irePP?.level ? (
        <TableStudyLevelChip level={data.irePP.level} />
      ) : null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
  {
    field: 'irePP.examinable',
    headerName: t('common:examinable'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueGetter: ({ data }) => data?.irePP?.examinable,
    valueFormatter: ({ data }) =>
      data?.irePP?.examinable ? t('common:yes') : t('common:no'),
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.examinable', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups, any>) => (
      <TableBooleanValue value={Boolean(data?.irePP?.examinable)} />
    ),
  },
];

export default function StudentProfileClassesPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const permissions = usePermissions();
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const { sendMailToParties } = useMailSettings();
  const { displayNames } = usePreferredNameLayout();
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const { data: subjectGroupsData } = useStudentsSubjectGroups([
    studentId ?? 0,
  ]);
  const { mutateAsync: updateStudentSubjectGroup } =
    useUpdateStudentSubjectGroup();

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames, permissions),
    [t, displayNames]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(
    () => [
      {
        label: t('people:sendSms'),
        icon: <MobileIcon />,
        onClick: onOpenSendSms,
        hasAccess: ({ isStaffUserWithPermission }) =>
          isStaffUserWithPermission('ps:1:communications:send_sms'),
      },
      {
        label: t('mail:sendMail'),
        icon: <SendMailIcon />,
        hasAccess: ({ isStaffUserWithPermission }) =>
          isStaffUserWithPermission(
            'api:communications:read:search_recipients'
          ),
        onClick: () => {
          sendMailToParties(
            selectedGroups.map((group) => group.id),
            [
              {
                label: t('mail:contactsOfStudentsInGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.SubjectGroupContact,
              },
              {
                label: t('mail:teachersOfGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.SubjectGroupStaff,
              },
              {
                label: t('mail:studentInGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.SubjectGroupStudent,
              },
            ]
          );
        },
      },
    ],
    [selectedGroups, sendMailToParties]
  );

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseStudentsSubjectGroups,
      'irePP.level' | 'irePP.examinable'
    >
  ) => {
    const updates = Object.entries(data).reduce<
      Core_UpdateStudentSubjectGroupInput[]
    >((acc, [partyId, changes]) => {
      const level = changes['irePP.level'];
      const examinable = changes['irePP.examinable'];

      acc.push({
        subjectGroupId: Number(partyId),
        studentId: studentId ?? 0,
        studyLevel: level?.newValue,
        examinable: examinable?.newValue,
      });

      return acc;
    }, []);

    return updateStudentSubjectGroup(updates);
  };

  return (
    <>
      <Table
        rowData={subjectGroupsData ?? []}
        columnDefs={studentColumns}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.partyId)}
        rightAdornment={
          <Fade in={selectedGroups.length > 0} unmountOnExit>
            <Box>
              <ActionMenu menuItems={actionMenuItems} />
            </Box>
          </Fade>
        }
        onBulkSave={handleBulkSave}
        onRowSelection={(groups) =>
          setSelectedGroups(
            groups.map(({ partyId, name, avatarUrl, subjects }) => {
              const subject = subjects?.[0];
              return {
                id: partyId,
                name,
                type: 'group',
                avatarUrl,
                avatarColor: subject?.colour,
              };
            })
          )
        }
      />

      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:teachersOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupStaff,
          },
        ]}
      />
    </>
  );
}
