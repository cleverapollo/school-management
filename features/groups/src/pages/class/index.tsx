import { Box, Container, Fade, Typography } from '@mui/material';
import {
  SmsRecipientType,
  UpdateClassGroupGroupInput,
  usePermissions,
} from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  ActionMenuProps,
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableAvatar,
  useDisclosure,
  usePreferredNameLayout,
  sortStartNumberFirst,
} from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { MobileIcon, SendMailIcon } from '@tyro/icons';
import { TableStaffAutocomplete } from '@tyro/people';
import set from 'lodash/set';
import {
  useClassGroups,
  ReturnTypeFromUseClassGroups,
  useSaveClassGroupEdits,
} from '../../api/class-groups';

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

  const classGroupColumns = useMemo(
    () => getClassGroupColumns(t, isStaffUser, displayNames),
    [t, isStaffUser]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(() => {
    const commonActions = [
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

    return commonActions;
  }, []);

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
      <Page title={t('groups:classGroups')}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {t('groups:classGroups')}
          </Typography>
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
        </Container>
      </Page>
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
    </>
  );
}
