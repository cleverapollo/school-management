import { Box, Fade } from '@mui/material';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  PermissionUtils,
  SmsRecipientType,
  UpdateYearGroupEnrollmentInput,
  RecipientSearchType,
} from '@tyro/api';
import {
  ActionMenu,
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  TableAvatar,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { MobileIcon, PrinterIcon, SendMailIcon } from '@tyro/icons';
import set from 'lodash/set';
import { TableStaffMultipleAutocomplete } from '@tyro/people';
import { useMailSettings } from '@tyro/mail';
import {
  useYearGroups,
  useUpdateYearGroupLeads,
  ReturnTypeFromUseYearGroups,
} from '../../api/year-groups';
import { printGroupMembers } from '../../utils/print-group-members';

const getYearGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnType<typeof usePreferredNameLayout>['displayNames']
): GridOptions<ReturnTypeFromUseYearGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    checkboxSelection: ({ data }) => Boolean(data),
    lockVisible: true,
    sort: 'asc',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseYearGroups>) =>
      data ? (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.yearGroupEnrollmentPartyId ?? ''}`}
          avatarUrl={undefined}
          AvatarProps={{
            sx: {
              borderRadius: 1,
            },
          }}
        />
      ) : null,
  },
  {
    field: 'studentMembers.memberCount',
    headerName: t('common:members'),
    sortable: true,
  },
  {
    headerName: t('common:yearhead'),
    field: 'yearGroupLeads',
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    enableRowGroup: true,
    valueSetter: ({ data, newValue }) => {
      set(data, 'yearGroupLeads', newValue);
      return true;
    },
    valueFormatter: ({ data }) => displayNames(data?.yearGroupLeads),
    editable: true,
    cellEditor: TableStaffMultipleAutocomplete,
    suppressKeyboardEvent: ({ editing, event }) =>
      editing && event.key === 'Enter',
  },
];

export default function YearGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const { displayNames } = usePreferredNameLayout();
  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const { data: yearGroupData } = useYearGroups();
  const { sendMailToParties } = useMailSettings();
  const { mutateAsync: updateYearGroupLeads } = useUpdateYearGroupLeads();

  const yearGroupColumns = useMemo(
    () => getYearGroupsColumns(t, displayNames),
    [t, displayNames]
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
                type: RecipientSearchType.YearGroupContact,
              },
              {
                label: t('mail:studentInGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.YearGroupStudent,
              },
              {
                label: t('mail:yearHeadsOfGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.YearGroupStaff,
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
    ],
    [selectedGroups, onOpenSendSms, sendMailToParties, t]
  );

  const handleBulkSave = (
    data: BulkEditedRows<ReturnTypeFromUseYearGroups, 'yearGroupLeads'>
  ) => {
    const updates = Object.entries(data).reduce<
      UpdateYearGroupEnrollmentInput[]
    >((acc, [partyId, changes]) => {
      const yearGroupLeads = changes?.yearGroupLeads?.newValue;
      if (Array.isArray(yearGroupLeads) && yearGroupLeads.length > 0) {
        const yearGroupLeadUpdates = yearGroupLeads.map((yearGroupLead) => ({
          yearGroupEnrollmentPartyId: Number(partyId),
          yearGroupLead: yearGroupLead?.partyId,
        }));
        return [...acc, ...yearGroupLeadUpdates];
      }

      return acc;
    }, []);

    return updateYearGroupLeads(updates);
  };

  return (
    <>
      <PageContainer title={t('groups:yearGroups')}>
        <PageHeading
          title={t('groups:yearGroups')}
          titleProps={{ variant: 'h3' }}
        />
        <Table
          rowData={yearGroupData ?? []}
          columnDefs={yearGroupColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.yearGroupEnrollmentPartyId)}
          rightAdornment={
            <Fade in={selectedGroups.length > 0} unmountOnExit>
              <Box>
                <ActionMenu menuItems={actionMenuItems} />
              </Box>
            </Fade>
          }
          onRowSelection={(groups) =>
            setSelectedGroups(
              groups.map(({ yearGroupEnrollmentPartyId, name }) => ({
                id: yearGroupEnrollmentPartyId,
                name,
                type: 'group',
                avatarUrl: undefined,
              }))
            )
          }
          onBulkSave={handleBulkSave}
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
            type: SmsRecipientType.YearGroupContact,
          },
          {
            label: t('sms:teachersOfGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.YearGroupStaff,
          },
        ]}
      />
    </>
  );
}
