import { useMemo } from 'react';
import { Box, Fade } from '@mui/material';
import {
  ActionMenu,
  ActionMenuProps,
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  usePreferredNameLayout,
} from '@tyro/core';
import { EditIcon } from '@tyro/icons';
import { TFunction, useTranslation } from '@tyro/i18n';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import {
  useSyncRequests,
  ReturnTypeFromUseSyncRequests,
} from '../../api/ppod/sync-requests';
import { SyncStatusChip } from '../../components/ppod/sync-status-chip';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseSyncRequests>['columnDefs'] => [
  {
    field: 'requestedOn',
    headerName: t('common:dateAndTime'),
    enableRowGroup: true,
    sortable: true,
    sort: 'desc',
    valueFormatter: ({ data }) =>
      data?.requestedOn ? dayjs(data?.requestedOn).format('lll') : '',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'syncRequestStatus',
    headerName: t('settings:ppodSync.status'),
    enableRowGroup: true,
    valueGetter: ({ data }) =>
      data?.syncRequestStatus
        ? t(`settings:ppodSyncStatus.${data?.syncRequestStatus}`)
        : '',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSyncRequests, any>) =>
      data?.syncRequestStatus ? (
        <SyncStatusChip status={data.syncRequestStatus} />
      ) : null,
  },
  {
    field: 'failureReason',
    headerName: t('settings:ppodSync.failureReason'),
    enableRowGroup: true,
    sortable: true,
  },
  {
    field: 'requester',
    headerName: t('settings:ppodSync.performedBy'),
    valueGetter: ({ data }) => displayName(data?.requester),
    enableRowGroup: true,
    sortable: true,
  },
];

export default function Sync() {
  const { t } = useTranslation(['common', 'settings']);
  const { displayName } = usePreferredNameLayout();

  const { data: syncRequests } = useSyncRequests({});

  const myColumnDefs = useMemo(
    () => getColumnDefs(t, displayName),
    [t, displayName]
  );

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(() => {
    const commonActions = [
      {
        label: t('settings:ppodSync.enterSyncCredentials'),
        icon: <EditIcon />,
        navigateTo: '/settings/ppod/login',
      },
    ];

    return [commonActions];
  }, []);

  return (
    <Table
      rowData={syncRequests ?? []}
      columnDefs={myColumnDefs}
      getRowId={({ data }) => String(data?.id)}
      rightAdornment={
        <Fade in unmountOnExit>
          <Box>
            <ActionMenu menuItems={actionMenuItems} />
          </Box>
        </Fade>
      }
    />
  );
}
