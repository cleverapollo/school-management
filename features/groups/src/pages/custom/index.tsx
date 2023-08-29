import { Box, Button, Fade } from '@mui/material';
import { SmsRecipientType, usePermissions } from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  ActionMenuProps,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  TableAvatar,
  useDisclosure,
} from '@tyro/core';
import { AddIcon, MobileIcon, SendMailIcon } from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { Link } from 'react-router-dom';
import {
  useCustomGroups,
  ReturnTypeFromUseCustomGroups,
} from '../../api/custom-groups';

const getCustomGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  isStaffUser: boolean
): GridOptions<ReturnTypeFromUseCustomGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    headerCheckboxSelection: isStaffUser,
    headerCheckboxSelectionFilteredOnly: isStaffUser,
    checkboxSelection: ({ data }) => Boolean(data) && isStaffUser,
    lockVisible: true,
    sort: 'asc',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCustomGroups>) =>
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
  },
  {
    headerName: t('common:members'),
    filter: true,
    valueGetter: ({ data }) =>
      (data?.studentMembers?.memberCount ?? 0) +
      (data?.staffMembers?.memberCount ?? 0) +
      (data?.contactMembers?.memberCount ?? 0),
  },
];

export default function CustomGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail', 'sms']);
  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const { isStaffUser } = usePermissions();
  const { data: customGroupData } = useCustomGroups();
  const showActionMenu = isStaffUser && selectedGroups.length > 0;
  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const customGroupColumns = useMemo(
    () => getCustomGroupsColumns(t, isStaffUser),
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

  return (
    <>
      <PageContainer title={t('groups:customGroups')}>
        <PageHeading
          title={t('groups:customGroups')}
          titleProps={{ variant: 'h3' }}
          rightAdornment={
            <Box display="flex" alignItems="center">
              <Button
                variant="contained"
                component={Link}
                to="./create"
                startIcon={<AddIcon />}
              >
                {t('groups:createCustomGroup')}
              </Button>
            </Box>
          }
        />
        <Table
          rowData={customGroupData ?? []}
          columnDefs={customGroupColumns}
          rowSelection="multiple"
          getRowId={({ data }) => String(data?.partyId)}
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
            label: t('sms:staffInGroup', {
              count: selectedGroups.length,
            }),
            type: SmsRecipientType.GeneralGroupStaff,
          },
        ]}
      />
    </>
  );
}
