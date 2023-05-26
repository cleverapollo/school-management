import { useMemo } from 'react';
import { Box, Fade, Stack } from '@mui/material';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useNavigate } from 'react-router-dom';
import {
  ActionMenu,
  ActionMenuProps,
  GridOptions,
  ICellRendererParams,
  Table,
  TablePersonAvatar,
} from '@tyro/core';

import { MobileIcon } from '@tyro/icons';
import { TFunction, useTranslation } from '@tyro/i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import dayjs from 'dayjs';

import { useSyncRequests, ReturnTypeFromUseSyncRequests } from '../../api/ppod';

type SyncRequestStatus = 'SUCCESS' | 'ERROR' | 'FAIL';

type Requester = {
  partyId: string;
  title: string;
  titleId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  type: string;
};

type PpodSyncRequestData = {
  id: number;
  syncRequestStatus: SyncRequestStatus;
  requesterPartyId: number;
  requester: Requester;
  requestedOn: string;
};

const ppodSyncRequestData: PpodSyncRequestData[] = [
  {
    id: 1,
    syncRequestStatus: 'SUCCESS',
    requesterPartyId: 12345,
    requester: {
      partyId: '12345',
      title: 'Mr',
      titleId: '123',
      firstName: 'John',
      lastName: 'Doe',
      avatarUrl: 'https://example.com/avatar',
      type: 'Staff',
    },
    requestedOn: '2023-05-10T09:15:00Z',
  },
  {
    id: 2,
    syncRequestStatus: 'ERROR',
    requesterPartyId: 54321,
    requester: {
      partyId: '54321',
      title: 'Mr',
      titleId: '4',
      firstName: 'John',
      lastName: 'Smith',
      avatarUrl: 'https://example.com/avatar',
      type: 'Staff',
    },
    requestedOn: '2023-04-19T14:35:00Z',
  },
  {
    id: 3,
    syncRequestStatus: 'FAIL',
    requesterPartyId: 54321,
    requester: {
      partyId: '54322',
      title: 'Ms',
      titleId: '4',
      firstName: 'Jane',
      lastName: 'Smith',
      avatarUrl: 'https://example.com/avatar',
      type: 'Staff',
    },
    requestedOn: '2023-04-18T12:30:00Z',
  },
];

const getColumnDefs = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<
  ReturnTypeFromUseSyncRequests | PpodSyncRequestData
>['columnDefs'] => [
  {
    field: 'requester',
    headerName: t('settings:ppodSync.completedBy'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<
      ReturnTypeFromUseSyncRequests | PpodSyncRequestData,
      any
    >) => {
      const person = {
        firstName: data?.requester?.firstName ?? '',
        lastName: data?.requester?.lastName ?? '',
      };
      return data ? <TablePersonAvatar person={person} /> : null;
    },
  },
  {
    field: 'requestedOn',
    headerName: t('settings:ppodSync.date'),
    enableRowGroup: true,
    valueFormatter: ({ data }) =>
      dayjs(data?.requestedOn).format('DD/MM/YYYY') ?? '',
  },
  {
    field: 'requestedOn',
    headerName: t('settings:ppodSync.time'),
    enableRowGroup: true,
    valueFormatter: ({ data }) =>
      dayjs(data?.requestedOn).format('HH:mm') ?? '',
  },
  {
    field: 'syncRequestStatus',
    headerName: t('settings:ppodSync.status'),
    enableRowGroup: true,
    valueFormatter: ({ data }) => data?.syncRequestStatus ?? '',
  },
];

export default function Sync() {
  const { t } = useTranslation(['common', 'settings']);
  const navigate = useNavigate();

  const useSyncRequestsParams = {
    from: '2022-03-01T00:00:00Z',
    to: '2023-05-15T23:59:59Z',
  };

  const { data: syncRequests } = useSyncRequests(useSyncRequestsParams);

  const myColumnDefs = useMemo(() => getColumnDefs(t), [t]);

  const tableData = useMemo(
    () =>
      Array.isArray(syncRequests) && syncRequests?.length > 0
        ? syncRequests
        : ppodSyncRequestData,
    [syncRequests]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(() => {
    const commonActions = [
      {
        label: t('settings:ppodSync.enterSyncCredentials'),
        // TODO: CHANGE ICON
        icon: <MobileIcon />,
        onClick: () => {
          navigate('/settings/ppod');
        },
      },
    ];

    return [commonActions];
  }, []);

  return (
    <Stack spacing={3}>
      <Table
        rowData={tableData ?? []}
        columnDefs={myColumnDefs}
        getRowId={({ data }) => String(data?.id)}
        rightAdornment={
          <Fade in unmountOnExit>
            <Box>
              <ActionMenu
                menuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                  },
                }}
                menuItems={actionMenuItems}
              />
            </Box>
          </Fade>
        }
      />
    </Stack>
  );
}
