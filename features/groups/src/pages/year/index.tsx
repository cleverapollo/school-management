import { Box, Container, Fade, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import { SmsRecipientType } from '@tyro/api';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableAvatar,
  useDisclosure,
  usePreferredNameLayout,
} from '@tyro/core';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { MobileIcon } from '@tyro/icons';
import {
  useYearGroups,
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
    enableRowGroup: true,
    valueGetter: ({ data }) => displayNames(data?.yearGroupLeads),
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

  return (
    <>
      <Page title={t('groups:yearGroups')}>
        <Container maxWidth="xl">
          <Typography variant="h3" component="h1" paragraph>
            {t('groups:yearGroups')}
          </Typography>
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
