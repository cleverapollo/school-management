import { Box, Fade } from '@mui/material';
import {
  PermissionUtils,
  RecipientSearchType,
  SmsRecipientType,
  SubjectGroupType,
  SubjectUsage,
  UpdateSubjectGroupInput,
  usePermissions,
} from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  ActionMenu,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableStudyLevelChip,
  StudyLevelSelectCellEditor,
  BulkEditedRows,
  TableAvatar,
  useDisclosure,
  sortStartNumberFirst,
  ConfirmDialog,
  TableSwitch,
  TableBooleanValue,
  TableSelect,
  PageContainer,
  PageHeading,
  useDebouncedValue,
} from '@tyro/core';

import {
  MobileIcon,
  MoveGroupIcon,
  PrinterIcon,
  SendMailIcon,
  TrashIcon,
} from '@tyro/icons';

import { set } from 'lodash';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { CatalogueSubjectOption, useCatalogueSubjects } from '@tyro/settings';
import { useMailSettings } from '@tyro/mail';
import {
  useSaveSubjectGroupEdits,
  useSubjectGroups,
  useSwitchSubjectGroupType,
} from '../../api/subject-groups';
import { printGroupMembers } from '../../utils/print-group-members';
import { DeleteGroupsModal } from '../../components/common/delete-groups-modal';

type ReturnTypeFromUseSubjectGroups = NonNullable<
  ReturnType<typeof useSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<('common' | 'groups')[]>,
  displayNames: ReturnTypeDisplayNames,
  subjects?: CatalogueSubjectOption[]
): GridOptions<ReturnTypeFromUseSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups>) => {
      if (!data) return null;

      const subject = data?.subjects?.[0];
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};

      return (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.partyId ?? ''}`}
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
    comparator: sortStartNumberFirst,
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    editable: true,
    valueSetter: ({ data, newValue }) => {
      const newOption = subjects?.find(({ id }) => id === newValue);

      set(data, 'subjects[0]', newOption ?? {});
      return true;
    },
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
    cellEditorSelector: () =>
      ({
        component: TableSelect<CatalogueSubjectOption>,
        popup: true,
        popupPosition: 'under',
        params: {
          options: subjects,
          optionIdKey: 'id',
          getOptionLabel: ({ name, nationalCode }: CatalogueSubjectOption) =>
            `${name} ${nationalCode ? `(${nationalCode})` : ''}`,
        },
      } as const),
    enableRowGroup: true,
  },
  {
    field: 'studentMembers.memberCount',
    headerName: t('common:members'),
    sortable: true,
  },
  {
    colId: 'year',
    headerName: t('common:year'),
    filter: true,
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.yearGroups?.map((year) => year?.name).join(', '),
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    editable: true,
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups, any>) =>
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
    }: ICellRendererParams<ReturnTypeFromUseSubjectGroups, any>) => (
      <TableBooleanValue value={Boolean(data?.irePP?.examinable)} />
    ),
  },
  {
    colId: 'studentGroupType',
    headerName: t('groups:groupType'),
    enableRowGroup: true,
    hide: true,
    valueGetter: ({ data }) =>
      data?.studentMembershipType?.type
        ? t(
            `groups:subjectGroupStudentMembershipType.${data.studentMembershipType.type}`
          )
        : t('groups:subjectGroupStudentMembershipType.UNKNOWN'),
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();
  const { isTyroUser } = usePermissions();
  const { data: subjectGroupsData } = useSubjectGroups();
  const { data: subjects } = useCatalogueSubjects({
    filterUsage: SubjectUsage.All,
  });
  const { sendMailToParties } = useMailSettings();
  const { mutateAsync: updateSubjectGroup } = useSaveSubjectGroupEdits();
  const { mutateAsync: switchSubjectGroupType } = useSwitchSubjectGroupType();
  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const [switchGroupTypeConfirmation, setSwitchGroupTypeConfirmation] =
    useState(false);

  const {
    value: deleteGroupIds,
    debouncedValue: debouncedDeleteGroupIds,
    setValue: setDeleteGroupIds,
  } = useDebouncedValue<number[] | null>({ defaultValue: null });

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames, subjects),
    [t, displayNames, subjects]
  );

  const actionMenuItems = useMemo(
    () => [
      {
        label: t('people:sendSms'),
        icon: <MobileIcon />,
        onClick: onOpenSendSms,
        hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
          isStaffUserWithPermission('ps:1:communications:send_sms'),
      },
      {
        label: t('mail:sendMail'),
        icon: <SendMailIcon />,
        hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
          isStaffUserWithPermission(
            'api:communications:read:search_recipients'
          ),
        onClick: () => {
          sendMailToParties(
            selectedGroups.map(({ id }) => id),
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
      {
        label: t('groups:subjectGroup.switchToSupportClass.action'),
        icon: <MoveGroupIcon />,
        onClick: () => setSwitchGroupTypeConfirmation(true),
        hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
          isStaffUserWithPermission('ps:1:groups:write_subject_groups'),
      },
      {
        label: t('groups:printGroupMembers'),
        icon: <PrinterIcon />,
        onClick: () => printGroupMembers(selectedGroups),
        hasAccess: ({ isStaffUserWithPermission }: PermissionUtils) =>
          isStaffUserWithPermission(
            'ps:1:printing_and_exporting:print_group_members'
          ),
      },
      {
        label: t('groups:deleteGroups', { count: selectedGroups.length }),
        icon: <TrashIcon />,
        onClick: () => setDeleteGroupIds(selectedGroups.map(({ id }) => id)),
        hasAccess: () => isTyroUser,
      },
    ],
    [selectedGroups, onOpenSendSms]
  );

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseSubjectGroups,
      'irePP.level' | 'irePP.examinable' | 'name' | 'subjects'
    >
  ) => {
    const updates = Object.entries(data).reduce<UpdateSubjectGroupInput[]>(
      (acc, [partyId, changes]) => {
        const updatedEntry: UpdateSubjectGroupInput = {
          subjectGroupPartyId: Number(partyId),
        };

        Object.entries(changes).forEach(([key, value]) => {
          if (key === 'irePP.level') {
            set(updatedEntry, 'irePP.level', value.newValue);
          } else if (
            key === 'subjects' &&
            Array.isArray(value?.newValue) &&
            value.newValue.length
          ) {
            set(updatedEntry, 'subjectIds', [
              (value?.newValue?.[0] as CatalogueSubjectOption)?.id,
            ]);
          } else {
            set(updatedEntry, key, value.newValue);
          }
        });

        acc.push(updatedEntry);
        return acc;
      },
      []
    );

    return updateSubjectGroup(updates);
  };

  return (
    <>
      <PageContainer title={t('groups:subjectGroups')}>
        <PageHeading
          title={t('groups:subjectGroups')}
          titleProps={{ variant: 'h3' }}
        />
        <Table
          rowData={subjectGroupsData ?? []}
          columnDefs={studentColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
          onBulkSave={handleBulkSave}
          rightAdornment={
            <Fade in={selectedGroups.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onRowSelection={(groups) =>
            setSelectedGroups(
              groups.map(
                ({ partyId, name, avatarUrl, subjects: groupsSubjects }) => {
                  const subject = groupsSubjects?.[0];
                  return {
                    id: partyId,
                    name,
                    type: 'group',
                    avatarUrl,
                    avatarColor: subject?.colour,
                  };
                }
              )
            )
          }
        />
      </PageContainer>
      <SendSmsModal
        isOpen={isSendSmsOpen}
        onClose={onCloseSendSms}
        recipients={selectedGroups}
        possibleRecipientTypes={[
          {
            label: t('sms:contactsOfStudentMembers', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupContact,
          },
          {
            label: t('sms:teachersOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.SubjectGroupStaff,
          },
        ]}
      />
      <ConfirmDialog
        open={!!switchGroupTypeConfirmation}
        title={t('groups:subjectGroup.switchToSupportClass.modalTitle')}
        description={t(
          'groups:subjectGroup.switchToSupportClass.modalDescription'
        )}
        confirmText={t('groups:subjectGroup.switchToSupportClass.confim')}
        onClose={() => setSwitchGroupTypeConfirmation(false)}
        onConfirm={() => {
          const partyIds = selectedGroups.map((sg) => sg.id);
          switchSubjectGroupType({
            subjectGroupPartyId: partyIds,
            type: SubjectGroupType.SupportGroup,
          }).then(() => setSwitchGroupTypeConfirmation(false));
        }}
      />
      <DeleteGroupsModal
        isOpen={Boolean(deleteGroupIds)}
        groupIds={deleteGroupIds ?? debouncedDeleteGroupIds}
        onClose={() => setDeleteGroupIds(null)}
      />
    </>
  );
}
