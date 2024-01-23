import { Box, Fade } from '@mui/material';
import {
  PermissionUtils,
  RecipientSearchType,
  SmsRecipientType,
  UpdateClassGroupGroupInput,
  usePermissions,
} from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  Table,
  TableAvatar,
  useDisclosure,
  usePreferredNameLayout,
  sortStartNumberFirst,
  PageContainer,
  PageHeading,
  useDebouncedValue,
} from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { MobileIcon, PrinterIcon, SendMailIcon, TrashIcon } from '@tyro/icons';
import { TableStaffAutocomplete } from '@tyro/people';
import set from 'lodash/set';
import { useMailSettings } from '@tyro/mail';
import { DeleteGroupsModal } from '../../components/common/delete-groups-modal';
import {
  useClassGroups,
  ReturnTypeFromUseClassGroups,
  useSaveClassGroupEdits,
} from '../../api';
import { printGroupMembers } from '../../utils/print-group-members';

const getClassGroupColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  isStaffUser: boolean,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseClassGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: isStaffUser,
    headerCheckboxSelectionFilteredOnly: isStaffUser,
    checkboxSelection: ({ data }) => Boolean(data) && isStaffUser,
    lockVisible: true,
    editable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseClassGroups>) =>
      data ? (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.partyId ?? ''}`}
          avatarUrl={data?.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
            },
          }}
        />
      ) : null,
    comparator: sortStartNumberFirst,
    sort: 'asc',
  },
  {
    headerName: t('common:members'),
    valueGetter: ({ data }) =>
      data ? data.studentMembers?.memberCount ?? 0 : null,
  },
  {
    field: 'yearGroups',
    headerName: t('common:year'),
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.yearGroups
        ?.sort((a, b) => a.yearGroupId - b.yearGroupId)
        .map((year) => year?.name)
        .join(', '),
    sort: 'asc',
    sortIndex: 0,
    filter: true,
  },
  {
    headerName: t('common:tutor'),
    field: 'tutors',
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    valueFormatter: ({ data }) => displayNames(data?.tutors),
    valueSetter: ({ data, newValue }) => {
      set(data, 'tutors', newValue ?? []);
      return true;
    },
    editable: true,
    cellEditor: TableStaffAutocomplete,
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
  },
  {
    field: 'yearGroupLeads',
    headerName: t('common:yearhead'),
    enableRowGroup: true,
    valueGetter: ({ data }) => displayNames(data?.yearGroupLeads),
  },
  {
    field: 'programmeStages',
    headerName: t('common:programme'),
    valueGetter: ({ data }) =>
      data?.programmeStages
        ?.map((programmeStage) => programmeStage?.programme?.name)
        ?.filter(Boolean)
        .join(', '),
    enableRowGroup: true,
    filter: true,
  },
];

export default function ClassGroupsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const { displayNames } = usePreferredNameLayout();
  const { isStaffUser, isTyroUser } = usePermissions();
  const { data: classGroupData } = useClassGroups();
  const { mutateAsync: updateClassGroup } = useSaveClassGroupEdits();
  const { sendMailToParties } = useMailSettings();
  const showActionMenu = isStaffUser && selectedGroups.length > 0;
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const {
    value: deleteGroupIds,
    debouncedValue: debouncedDeleteGroupIds,
    setValue: setDeleteGroupIds,
  } = useDebouncedValue<number[] | null>({ defaultValue: null });
  const classGroupColumns = useMemo(
    () => getClassGroupColumns(t, isStaffUser, displayNames),
    [t, isStaffUser]
  );

  const actionMenuItems = useMemo(
    () => [
      {
        label: t('people:sendSms'),
        icon: <MobileIcon />,
        onClick: onOpenSendSms,
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
                type: RecipientSearchType.GeneralGroupContact,
              },
              {
                label: t('mail:studentInGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.GeneralGroupStudent,
              },
              {
                label: t('mail:tutorsOfGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.ClassGroupTutors,
              },
              {
                label: t('mail:yearHeadsOfGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.ClassGroupYearHeads,
              },
            ]
          );
        },
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
    [selectedGroups, onOpenSendSms, t, sendMailToParties]
  );

  const handleBulkSave = (
    data: BulkEditedRows<ReturnTypeFromUseClassGroups, 'tutors' | 'name'>
  ) => {
    const updates = Object.entries(data).reduce<UpdateClassGroupGroupInput[]>(
      (acc, [partyId, changes]) => {
        const changeKeys = Object.keys(changes) as Array<keyof typeof changes>;
        const changesByKey = changeKeys.reduce<UpdateClassGroupGroupInput>(
          (changeAcc, key) => {
            if (key === 'tutors') {
              const tutors = changes?.tutors?.newValue;
              const [tutor] = tutors ?? [];
              changeAcc.tutor = tutor?.partyId;
            } else {
              const value = changes[key];
              changeAcc[key] = value?.newValue;
            }

            return changeAcc;
          },
          {
            classGroupPartyId: Number(partyId),
          }
        );

        acc.push(changesByKey);

        return acc;
      },
      []
    );

    return updateClassGroup(updates);
  };

  return (
    <>
      <PageContainer title={t('groups:classGroups')}>
        <PageHeading
          title={t('groups:classGroups')}
          titleProps={{ variant: 'h3' }}
        />
        <Table
          rowData={classGroupData ?? []}
          columnDefs={classGroupColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
          onBulkSave={handleBulkSave}
          rightAdornment={
            <Fade in={showActionMenu} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onRowSelection={(groups) =>
            setSelectedGroups(
              groups.map(({ partyId, name, avatarUrl }) => ({
                id: partyId,
                name,
                type: 'group',
                avatarUrl,
              }))
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
            type: SmsRecipientType.GeneralGroupContact,
          },
          {
            label: t('sms:tutorsAndYearHeadsOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.ClassGroupStaff,
          },
        ]}
      />
      <DeleteGroupsModal
        isOpen={Boolean(deleteGroupIds)}
        groupIds={deleteGroupIds ?? debouncedDeleteGroupIds}
        onClose={() => setDeleteGroupIds(null)}
      />
    </>
  );
}
