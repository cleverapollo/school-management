import { Box, Fade } from '@mui/material';
import {
  PermissionUtils,
  SearchType,
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
} from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { MobileIcon, PrinterIcon, SendMailIcon } from '@tyro/icons';
import { TableStaffAutocomplete } from '@tyro/people';
import set from 'lodash/set';
import { SendMailModal } from '@tyro/mail';
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
  const { isStaffUser } = usePermissions();
  const { data: classGroupData } = useClassGroups();
  const { mutateAsync: updateClassGroup } = useSaveClassGroupEdits();
  const showActionMenu = isStaffUser && selectedGroups.length > 0;
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const {
    isOpen: isSendMailOpen,
    onOpen: onOpenSendMail,
    onClose: onCloseSendMail,
  } = useDisclosure();

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
        onClick: onOpenSendMail,
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
    ],
    [selectedGroups, onOpenSendSms, onOpenSendMail]
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
      <SendMailModal
        isOpen={isSendMailOpen}
        onClose={onCloseSendMail}
        recipients={selectedGroups}
        possibleRecipientTypes={[
          {
            label: t('mail:contactInGroup', {
              count: selectedGroups.length,
            }),
            type: SearchType.GeneralGroupContact,
          },
          {
            label: t('mail:studentInGroup', {
              count: selectedGroups.length,
            }),
            type: SearchType.GeneralGroupStudent,
          },
          {
            label: t('mail:staffInGroup', {
              count: selectedGroups.length,
            }),
            type: SearchType.GeneralGroupStaff,
          },
        ]}
      />
    </>
  );
}
