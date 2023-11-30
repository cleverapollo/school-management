import { Box, Button, Fade } from '@mui/material';
import {
  SearchType,
  PermissionUtils,
  SmsRecipientType,
  usePermissions,
} from '@tyro/api';
import { useMemo, useState } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  TableAvatar,
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
import { SendMailModal } from '@tyro/mail';
import { Link } from 'react-router-dom';
import {
  useCustomGroups,
  ReturnTypeFromUseCustomGroups,
} from '../../api/custom-groups';
import { DeleteCustomGroupsModal } from '../../components/custom-group/delete-custom-groups-modal';
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
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
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
  const [deleteGroupIds, setDeleteGroupIds] = useState<number[] | null>();
  const { isStaffUser, hasPermission } = usePermissions();
  const { data: customGroupData } = useCustomGroups();

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
        onClick: onOpenSendMail,
      },
      {
        label: t('groups:deleteCustomGroups'),
        icon: <TrashIcon />,
        onClick: () => setDeleteGroupIds(selectedGroups.map(({ id }) => id)),
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
      <DeleteCustomGroupsModal
        groupIds={deleteGroupIds}
        onClose={() => setDeleteGroupIds(null)}
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
