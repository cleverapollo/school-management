import { useState, useMemo } from 'react';
import { Box, Fade } from '@mui/material';
import {
  BulkEditedRows,
  GridOptions,
  ICellRendererParams,
  Table,
  TableAvatar,
  usePreferredNameLayout,
  ActionMenu,
  useDisclosure,
  ReturnTypeDisplayName,
  ReturnTypeDisplayNames,
  ValueSetterParams,
} from '@tyro/core';
import { AccessUserType, UpdateStudentContactInput } from '@tyro/api';
import { MailIcon, StopIcon } from '@tyro/icons';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import set from 'lodash/set';
import { useUpdateStudentContactsEmail } from '../../api/user-access/update-contacts-email';

import {
  OriginPath,
  useUserTypeFromPathname,
} from '../../utils/get-user-type-from-pathname';

import {
  useUserAccess,
  ReturnTypeFromUseUserAccess,
} from '../../api/user-access/user-access';
import { InviteUsersModal } from '../../components/user-access/invite-users-modal';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<('common' | 'settings')[]>,
  displayName: ReturnTypeDisplayName,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseUserAccess>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'personalInfo',
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    valueGetter: ({ data }) => displayName(data?.personalInfo),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseUserAccess>) =>
      data ? <TableAvatar name={displayName(data?.personalInfo)} /> : null,
    checkboxSelection: ({ data }) => Boolean(data),
  },
  {
    field: 'contactStudents',
    headerName: t('common:students'),
    valueGetter: ({ data }) =>
      displayNames(data?.contactStudents?.map((student) => student)),
  },
  {
    headerName: t('common:email'),
    field: 'personalInfo.primaryEmail.email',
    editable: true,
    valueSetter: (params: ValueSetterParams<ReturnTypeFromUseUserAccess>) => {
      set(
        params?.data ?? {},
        `personalInfo.primaryEmail.email`,
        params?.newValue ?? null
      );
      return true;
    },
  },
  {
    headerName: t('common:status'),
    field: 'status',
    valueFormatter: ({ data }) =>
      data && data?.status
        ? t(`settings:userAccessStatus.${data?.status}`)
        : '-',
  },
  {
    headerName: t('settings:inviteSentOn'),
    field: 'invitedOn',
    valueGetter: ({ data }) =>
      data && data.invitedOn ? dayjs(data.invitedOn).format('ll LT') : '-',
  },
  {
    headerName: t('settings:lastActiveWeb'),
    field: 'webLastLogin',
    valueGetter: ({ data }) =>
      data && data.webLastLogin
        ? dayjs(data.webLastLogin).format('ll LT')
        : '-',
  },
  {
    headerName: t('settings:lastActiveNative'),
    field: 'mobileLastLogin',
    valueGetter: ({ data }) =>
      data && data.mobileLastLogin
        ? dayjs(data.mobileLastLogin).format('ll LT')
        : '-',
  },
  {
    headerName: t('settings:nativeAppVersion'),
    field: 'mobileAppVersion',
    valueGetter: ({ data }) => data?.mobileAppVersion ?? '-',
  },
  {
    field: 'yearGroupContacts',
    headerName: t('common:year'),
    filter: true,
    valueGetter: ({ data }) =>
      data?.yearGroupContacts?.map((yg) => yg?.shortName).join(', ') ?? '',
  },
];

export default function UserAccessContactsPage() {
  const { t } = useTranslation(['common', 'people', 'settings']);
  const [selectedInvites, setSelectedInvites] =
    useState<ReturnTypeFromUseUserAccess[]>();

  const { displayName, displayNames } = usePreferredNameLayout();

  const userType = useUserTypeFromPathname(OriginPath.access) as AccessUserType;

  const { data: userAccess } = useUserAccess({
    userType,
  });

  const { mutateAsync: updateStudentContactsEmail } =
    useUpdateStudentContactsEmail();

  const columns = useMemo(
    () => getColumns(t, displayName, displayNames),
    [t, displayName, displayNames]
  );

  const {
    isOpen: isInviteUsersOpen,
    onOpen: onOpenInviteUsers,
    onClose: onCloseInviteUsers,
  } = useDisclosure();

  const handleBulkSave = (
    data: BulkEditedRows<
      ReturnTypeFromUseUserAccess,
      'personalInfo.primaryEmail.email'
    >
  ) => {
    const input = Object.keys(data).map<UpdateStudentContactInput>((key) => {
      const newEmail = data[key]['personalInfo.primaryEmail.email']?.newValue;
      return {
        primaryEmail: newEmail,
        contactPartyId: Number(key),
      };
    });

    return updateStudentContactsEmail(input);
  };

  return (
    <>
      <Table
        rowData={userAccess ?? []}
        columnDefs={columns}
        statusBar={{
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
          ],
        }}
        getRowId={({ data }) => String(data?.personPartyId)}
        rowSelection="multiple"
        rightAdornment={
          <Fade
            in={Array.isArray(selectedInvites) && selectedInvites?.length > 0}
            unmountOnExit
          >
            <Box>
              <ActionMenu
                menuItems={[
                  {
                    label: t('settings:inviteUsers'),
                    icon: <MailIcon />,
                    onClick: onOpenInviteUsers,
                  },
                  {
                    label: t('settings:deactivateUsers'),
                    icon: <StopIcon />,
                    disabled: true,
                    onClick: () => 'disabled',
                  },
                ]}
              />
            </Box>
          </Fade>
        }
        onRowSelection={(newSelectedInvites) => {
          setSelectedInvites(
            newSelectedInvites?.map((invitedPerson) => invitedPerson)
          );
        }}
        onBulkSave={handleBulkSave}
      />
      <InviteUsersModal
        isOpen={isInviteUsersOpen}
        onClose={onCloseInviteUsers}
        recipients={selectedInvites}
      />
    </>
  );
}
