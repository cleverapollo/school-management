import { useState, useMemo } from 'react';
import { Box, Fade } from '@mui/material';
import {
  BulkEditedRows,
  GridOptions,
  Table,
  usePreferredNameLayout,
  ActionMenu,
  useDisclosure,
  ReturnTypeDisplayName,
} from '@tyro/core';
import { AccessUserType, UpdateStaffInput } from '@tyro/api';
import { MailIcon, StopIcon } from '@tyro/icons';
import { useLocation } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import set from 'lodash/set';
import { useUpdateStaffEmail } from '../../api/user-access/update-staff-email';

import {
  useUserAccess,
  ReturnTypeFromUseUserAccess,
} from '../../api/user-access/user-access';
import { InviteUsersModal } from '../../components/user-access/invite-users-modal';

dayjs.extend(LocalizedFormat);

const getColumns = (
  t: TFunction<('common' | 'settings')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseUserAccess>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'person',
    sort: 'asc',
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    valueGetter: ({ data }) => {
      const person = {
        firstName: data?.personalInfo.firstName,
        lastName: data?.personalInfo.lastName,
      };
      return displayName(person);
    },
    checkboxSelection: ({ data }) => Boolean(data),
  },
  {
    headerName: t('common:email'),
    field: 'personalInfo.primaryEmail.email',
    editable: true,
    valueSetter: ({ data, newValue }) => {
      if (newValue) {
        set(data ?? {}, `personalInfo.primaryEmail.email`, newValue);
        return true;
      }
      return false;
    },
  },
  {
    headerName: t('common:status'),
    field: 'status',
    valueFormatter: ({ data }) =>
      data && data?.status
        ? `${data?.status.charAt(0).toUpperCase()}` +
          `${data?.status.slice(1).toLowerCase()}`
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
    headerName: t('settings:lastActiveMobile'),
    field: 'mobileLastLogin',
    valueGetter: ({ data }) =>
      data && data.mobileLastLogin
        ? dayjs(data.mobileLastLogin).format('ll LT')
        : '-',
  },
];

function getUserTypeFromPathname(pathname: string) {
  if (pathname.includes('staff')) {
    return AccessUserType.Staff;
  }
  if (pathname.includes('contacts')) {
    return AccessUserType.Contact;
  }
  if (pathname.includes('students')) {
    return AccessUserType.Student;
  }
  return AccessUserType.Staff;
}

export default function UserAccessStaffPage() {
  const { t } = useTranslation(['common', 'people', 'settings']);
  const [selectedInvites, setSelectedInvites] =
    useState<ReturnTypeFromUseUserAccess[]>();

  const { displayName } = usePreferredNameLayout();

  const currentUrl = useLocation();

  const userType: AccessUserType = getUserTypeFromPathname(
    currentUrl?.pathname
  );

  const { data: userAccess } = useUserAccess({ userType });
  const { mutateAsync: updateStaffEmail } = useUpdateStaffEmail();

  const columns = useMemo(() => getColumns(t, displayName), [t, displayName]);

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
    const input = Object.keys(data).map<UpdateStaffInput>((key) => {
      const newEmail = data[key]['personalInfo.primaryEmail.email']?.newValue;
      return {
        primaryEmail: newEmail,
        staffPartyId: Number(key),
      };
    });

    return updateStaffEmail(input);
  };

  return (
    <>
      <Table
        rowData={userAccess ?? []}
        columnDefs={columns}
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
                    label: t('settings:sendInvite'),
                    icon: <MailIcon />,
                    onClick: onOpenInviteUsers,
                  },
                  {
                    label: t('settings:disable'),
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
