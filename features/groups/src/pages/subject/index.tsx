import { Box, Fade } from '@mui/material';
import {
  Core_ModifySubjectGroupMembershipType,
  PermissionUtils,
  RecipientSearchType,
  SmsRecipientType,
  SubjectGroupStudentMembershipType,
  SubjectGroupStudentMembershipTypeEnum,
  SubjectGroupType,
  SubjectUsage,
  UpdateSubjectGroupInput,
  usePermissions,
  UsePermissionsReturn,
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
  ValueFormatterParams,
  ValueSetterParams,
  useToast,
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
import { SubjectGroupTypeCellEditor } from '../../components/subject-group/group-type-cell-editor';
import { TableBlockAutocomplete } from '../../components';
import { TableClassGroupAutocomplete } from '../../components/common/class-group-autocomplete';
import { useUpdateSubjectGroupsMembershipType } from '../../api/update-subject-membership-type';

type ReturnTypeFromUseSubjectGroups = NonNullable<
  ReturnType<typeof useSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<('common' | 'groups')[]>,
  displayNames: ReturnTypeDisplayNames,
  subjects?: CatalogueSubjectOption[],
  permissions?: UsePermissionsReturn
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
    field: 'studentMembershipType.type',
    headerName: t('groups:groupType'),
    enableRowGroup: true,
    hide: true,
    editable: permissions?.isTyroUser,
    valueFormatter: ({ data }) =>
      data?.studentMembershipType?.type
        ? t(
            `groups:subjectGroupStudentMembershipType.${data.studentMembershipType.type}`
          )
        : t('groups:subjectGroupStudentMembershipType.UNKNOWN'),
    valueSetter: ({
      data,
      newValue,
      node,
      isApplyUpdatesCall,
    }: ValueSetterParams<
      ReturnTypeFromUseSubjectGroups,
      SubjectGroupStudentMembershipTypeEnum
    >) => {
      set(data, 'studentMembershipType.type', newValue);

      if (
        !isApplyUpdatesCall &&
        newValue !== SubjectGroupStudentMembershipTypeEnum.Core
      ) {
        node?.setDataValue('studentMembershipType', null);
      }

      if (
        !isApplyUpdatesCall &&
        newValue !== SubjectGroupStudentMembershipTypeEnum.Block
      ) {
        node?.setDataValue('studentMembershipType.blockId', null);
      }

      return true;
    },
    valueGetter: ({ data }) => data?.studentMembershipType?.type,
    cellEditorSelector: SubjectGroupTypeCellEditor(t),
  },
  {
    field: 'studentMembershipType',
    headerName: t('common:classGroup'),
    hide: true,
    valueGetter: ({ data }) => {
      const { classGroupId, classGroupName } =
        data?.studentMembershipType ?? {};

      return classGroupId && classGroupName
        ? {
            partyId: classGroupId,
            name: classGroupName,
          }
        : null;
    },
    valueFormatter: ({
      value,
    }: ValueFormatterParams<
      ReturnTypeFromUseSubjectGroups,
      { name: string; partyId: number }
    >) => value?.name ?? '-',
    valueSetter: ({
      data,
      newValue,
      isApplyUpdatesCall,
    }: ValueSetterParams<
      ReturnTypeFromUseSubjectGroups,
      | { name: string; partyId: number }
      | ReturnTypeFromUseSubjectGroups['studentMembershipType']
      | string
    >) => {
      if (
        newValue &&
        typeof newValue === 'object' &&
        Object.keys(newValue).includes('classGroupId') &&
        isApplyUpdatesCall
      ) {
        const checkedValue =
          newValue as ReturnTypeFromUseSubjectGroups['studentMembershipType'];
        set(
          data,
          'studentMembershipType.classGroupId',
          checkedValue?.classGroupId
        );
        set(
          data,
          'studentMembershipType.classGroupName',
          checkedValue?.classGroupName
        );
        return true;
      }

      if (newValue && typeof newValue === 'string') {
        const parsedValue = JSON.parse(newValue) as {
          name: string;
          partyId: number;
        } | null;
        set(data, 'studentMembershipType.classGroupId', parsedValue?.partyId);
        set(data, 'studentMembershipType.classGroupName', parsedValue?.name);
        return true;
      }

      const checkedValue = newValue as { name: string; partyId: number } | null;

      set(data, 'studentMembershipType.classGroupId', checkedValue?.partyId);
      set(data, 'studentMembershipType.classGroupName', checkedValue?.name);
      return true;
    },
    editable: ({ data }) =>
      Boolean(
        permissions?.isTyroUser &&
          data?.studentMembershipType?.type ===
            SubjectGroupStudentMembershipTypeEnum.Core
      ),
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableClassGroupAutocomplete,
    cellClassRules: {
      'failed-cell': ({ data }) =>
        Boolean(
          data?.studentMembershipType?.type ===
            SubjectGroupStudentMembershipTypeEnum.Core &&
            !data?.studentMembershipType?.classGroupId
        ),
    },
  },
  {
    field: 'studentMembershipType.blockId',
    headerName: t('common:block'),
    hide: true,
    editable: ({ data }) =>
      Boolean(
        permissions?.isTyroUser &&
          data?.studentMembershipType?.type ===
            SubjectGroupStudentMembershipTypeEnum.Block
      ),
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    valueFormatter: ({
      value,
    }: ValueFormatterParams<ReturnTypeFromUseSubjectGroups, string>) =>
      value ?? '-',
    cellEditor: TableBlockAutocomplete,
    valueSetter: ({
      data,
      newValue,
    }: ValueSetterParams<ReturnTypeFromUseSubjectGroups, string>) => {
      set(data, 'studentMembershipType.blockId', newValue);
      return true;
    },
    cellClassRules: {
      'failed-cell': ({ data }) =>
        Boolean(
          data?.studentMembershipType?.type ===
            SubjectGroupStudentMembershipTypeEnum.Block &&
            !data?.studentMembershipType?.blockId
        ),
    },
  },
];

export default function SubjectGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();
  const permissions = usePermissions();
  const { data: subjectGroupsData } = useSubjectGroups();
  const { data: subjects } = useCatalogueSubjects({
    filterUsage: SubjectUsage.All,
  });
  const { sendMailToParties } = useMailSettings();
  const { mutateAsync: updateSubjectGroup } = useSaveSubjectGroupEdits();
  const { mutateAsync: updateSubjectGroupsMembershipType } =
    useUpdateSubjectGroupsMembershipType();
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
    () => getSubjectGroupsColumns(t, displayNames, subjects, permissions),
    [t, displayNames, subjects, permissions]
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
        hasAccess: ({ isStaffUserHasAllPermissions }: PermissionUtils) =>
          isStaffUserHasAllPermissions([
            'ps:1:communications:write_mail',
            'api:communications:read:search_recipients',
          ]),
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
      // {
      //   label: t('groups:deleteGroups', { count: selectedGroups.length }),
      //   icon: <TrashIcon />,
      //   onClick: () => setDeleteGroupIds(selectedGroups.map(({ id }) => id)),
      //   hasAccess: () => permissions.isTyroUser,
      // },
    ],
    [selectedGroups, onOpenSendSms, permissions]
  );

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseSubjectGroups,
      | 'irePP.level'
      | 'irePP.examinable'
      | 'name'
      | 'subjects'
      | 'studentMembershipType'
      | 'studentMembershipType.type'
      | 'studentMembershipType.blockId'
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
          } else if (
            ![
              'studentMembershipType',
              'studentMembershipType.type',
              'studentMembershipType.blockId',
            ].includes(key)
          ) {
            set(updatedEntry, key, value.newValue);
          }
        });

        acc.push(updatedEntry);
        return acc;
      },
      []
    );

    const subjectGroupTypeEdits = Object.entries(data).reduce<
      Core_ModifySubjectGroupMembershipType[]
    >((acc, [partyId, changes]) => {
      const updateGroup: Partial<Core_ModifySubjectGroupMembershipType> = {
        subjectGroupId: Number(partyId),
      };

      Object.entries(changes).forEach(([key, value]) => {
        switch (key) {
          case 'studentMembershipType': {
            const typedNewValue =
              value.newValue as unknown as SubjectGroupStudentMembershipType | null;
            set(updateGroup, 'classGroupId', typedNewValue?.classGroupId);
            break;
          }
          case 'studentMembershipType.type': {
            set(updateGroup, 'membershipType', value.newValue);
            break;
          }
          case 'studentMembershipType.blockId': {
            set(updateGroup, 'blockId', value.newValue);
            break;
          }
          default:
            break;
        }
      });

      if (Object.keys(updateGroup).length > 1) {
        if (updateGroup.classGroupId) {
          updateGroup.membershipType =
            SubjectGroupStudentMembershipTypeEnum.Core;
        } else if (updateGroup.blockId) {
          updateGroup.membershipType =
            SubjectGroupStudentMembershipTypeEnum.Block;
        } else {
          updateGroup.membershipType =
            SubjectGroupStudentMembershipTypeEnum.Freeform;
        }

        acc.push(updateGroup as Core_ModifySubjectGroupMembershipType);
      }
      return acc;
    }, []);

    return Promise.all([
      updates.length > 0 ? updateSubjectGroup(updates) : undefined,
      subjectGroupTypeEdits.length > 0
        ? updateSubjectGroupsMembershipType(subjectGroupTypeEdits)
        : undefined,
    ]);
  };

  return (
    <>
      <PageContainer title={t('groups:subjectGroups')}>
        <PageHeading
          title={t('groups:subjectGroups')}
          titleProps={{ variant: 'h3' }}
        />
        <Table
          sx={{
            '& .failed-cell': {
              backgroundColor: 'red.100',
            },
          }}
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
