import { Box, Fade } from '@mui/material';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import { SmsRecipientType, UpdateYearGroupEnrollmentInput } from '@tyro/api';
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
import { MobileIcon } from '@tyro/icons';
import set from 'lodash/set';
import { TableStaffMultipleAutocomplete } from './table-staff-autocomplete';
import {
  useYearGroups,
  useUpdateYearGroupLeads,
  ReturnTypeFromUseYearGroups,
} from '../../api/year-groups';

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
    field: 'members',
    headerName: t('common:members'),
    filter: true,
  },
  {
    headerName: t('common:yearhead'),
    field: 'yearGroupLeads',
    cellClass: 'disable-cell-edit-style',
    enableRowGroup: true,
    valueSetter: ({ data, newValue }) => {
      set(data, 'yearGroupLeads', newValue);
      return true;
    },
    valueFormatter: ({ data }) => displayNames(data?.yearGroupLeads),
    editable: true,
    cellEditor: TableStaffMultipleAutocomplete,
    cellEditorParams: {
      multiple: true,
    },
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
  const { mutateAsync: updateYearGroupLeads } = useUpdateYearGroupLeads();

  const yearGroupColumns = useMemo(
    () => getYearGroupsColumns(t, displayNames),
    [t, displayNames]
  );

  const actionMenuItems = [
    {
      label: t('people:sendSms'),
      icon: <MobileIcon />,
      onClick: onOpenSendSms,
    },
    // {
    //   label: t('mail:sendMail'),
    //   icon: <SendMailIcon />,
    //   onClick: () => {},
    // },
  ];

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
    </>
  );
}
