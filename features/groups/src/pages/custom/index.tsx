import { Box, Button, Fade } from '@mui/material';
import {
  PermissionUtils,
  SmsRecipientType,
  usePermissions,
  RecipientSearchType,
} from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  commonActionMenuProps,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  TableAvatar,
  useDebouncedValue,
  useDisclosure,
} from '@tyro/core';
import {
  AddIcon,
  EditIcon,
  MobileIcon,
  PrinterIcon,
  SendMailIcon,
  TrashIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { RecipientsForSmsModal, SendSmsModal } from '@tyro/sms';
import { useMailSettings } from '@tyro/mail';
import { Link } from 'react-router-dom';
import { useCustomGroups, ReturnTypeFromUseCustomGroups } from '../../api';
import { DeleteGroupsModal } from '../../components/common/delete-groups-modal';
import { printGroupMembers } from '../../utils/print-group-members';

const getColumns = (
  t: TFunction<('common' | 'groups')[], undefined>,
  isStaffUser: boolean,
  showEditAction: boolean
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
  {
    ...commonActionMenuProps,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCustomGroups>) =>
      data &&
      showEditAction && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('common:actions.edit'),
              icon: <EditIcon />,
              navigateTo: `./edit/${data.partyId || ''}`,
            },
            // TODO: uncomment this when BE support
            // {
            //   label: t('common:actions.archive'),
            //   icon: <ArchiveIcon />,
            //   onClick: () => onArchive(data.partyId),
            // },
          ]}
        />
      ),
  },
];

export default function CustomGroups() {
  const { t } = useTranslation(['common', 'groups', 'people', 'sms', 'mail']);

  const [selectedGroups, setSelectedGroups] = useState<RecipientsForSmsModal>(
    []
  );
  const { sendMailToParties } = useMailSettings();
  const {
    value: deleteGroupIds,
    debouncedValue: debouncedDeleteGroupIds,
    setValue: setDeleteGroupIds,
  } = useDebouncedValue<number[] | null>({ defaultValue: null });
  const { isStaffUser, hasPermission, isTyroUser } = usePermissions();
  const { data: customGroupData } = useCustomGroups();

  const {
    isOpen: isSendSmsOpen,
    onOpen: onOpenSendSms,
    onClose: onCloseSendSms,
  } = useDisclosure();

  const showEditAction = hasPermission(
    'ps:1:groups:view_create_custom_group_definitions'
  );

  const columns = useMemo(
    () => getColumns(t, isStaffUser, showEditAction),
    [t, isStaffUser, showEditAction]
  );

  const showActionMenu = isStaffUser && selectedGroups.length > 0;

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
                label: t('mail:staffInGroup', {
                  count: selectedGroups.length,
                }),
                type: RecipientSearchType.GeneralGroupStaff,
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
        label: t('groups:deleteCustomGroups', { count: selectedGroups.length }),
        icon: <TrashIcon />,
        onClick: () => setDeleteGroupIds(selectedGroups.map(({ id }) => id)),
        hasAccess: () => isTyroUser,
      },
    ],
    [selectedGroups, onOpenSendSms, sendMailToParties, t]
  );

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
          columnDefs={columns}
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
      <DeleteGroupsModal
        isOpen={Boolean(deleteGroupIds)}
        groupIds={deleteGroupIds ?? debouncedDeleteGroupIds}
        onClose={() => setDeleteGroupIds(null)}
      />
    </>
  );
}
