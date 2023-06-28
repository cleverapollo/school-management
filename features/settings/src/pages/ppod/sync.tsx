import { useMemo } from 'react';
import { Box, Fade, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  ActionMenu,
  ActionMenuProps,
  GridOptions,
  ICellRendererParams,
  Table,
  TablePersonAvatar,
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
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseSyncRequests>['columnDefs'] => [
  // {
  //   field: 'requester',
  //   headerName: t('settings:ppodSync.completedBy'),
  //   cellRenderer: ({
  //     data,
  //   }: ICellRendererParams<ReturnTypeFromUseSyncRequests, any>) =>
  //     data ? <TablePersonAvatar person={data?.requester} /> : null,
  // },
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
];

export default function Sync() {
  const { t } = useTranslation(['common', 'settings']);
  const navigate = useNavigate();

  const { data: syncRequests } = useSyncRequests({});

  const myColumnDefs = useMemo(() => getColumnDefs(t), [t]);

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(() => {
    const commonActions = [
      {
        label: t('settings:ppodSync.enterSyncCredentials'),
        icon: <EditIcon />,
        onClick: () => {
          navigate('/settings/ppod/login');
        },
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
