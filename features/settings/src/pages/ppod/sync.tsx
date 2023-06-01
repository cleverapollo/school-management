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
import { useAcademicNamespace } from '@tyro/api';
import { EditIcon } from '@tyro/icons';
import { TFunction, useTranslation } from '@tyro/i18n';

import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

import {
  useSyncRequests,
  ReturnTypeFromUseSyncRequests,
} from '../../api/ppod/sync-requests';

dayjs.extend(LocalizedFormat);

const getColumnDefs = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseSyncRequests>['columnDefs'] => [
  {
    field: 'requester',
    headerName: t('settings:ppodSync.completedBy'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSyncRequests, any>) =>
      data ? <TablePersonAvatar person={data?.requester} /> : null,
  },
  {
    field: 'requestedOn',
    headerName: t('settings:ppodSync.date'),
    enableRowGroup: true,
    valueFormatter: ({ data }) =>
      data?.requestedOn ? dayjs(data?.requestedOn).format('LL') : '',
  },
  {
    field: 'requestedOn',
    headerName: t('settings:ppodSync.time'),
    enableRowGroup: true,
    valueFormatter: ({ data }) =>
      data?.requestedOn ? dayjs(data?.requestedOn).format('LT') : '',
  },
  {
    field: 'syncRequestStatus',
    headerName: t('settings:ppodSync.status'),
    enableRowGroup: true,
    valueFormatter: ({ data }) =>
      data?.syncRequestStatus
        ? t(`settings:ppodSync.${data?.syncRequestStatus}`)
        : '',
  },
];

export default function Sync() {
  const { t } = useTranslation(['common', 'settings']);
  const navigate = useNavigate();
  const { activeAcademicNamespace } = useAcademicNamespace();

  const { startDate, endDate } = activeAcademicNamespace || {};

  const formattedDates = {
    from: dayjs(startDate).format('YYYY-MM-DDTHH:mm:ss[Z]'),
    to: dayjs(endDate).format('YYYY-MM-DDTHH:mm:ss[Z]'),
  };

  const { data: syncRequests } = useSyncRequests(formattedDates);

  const myColumnDefs = useMemo(() => getColumnDefs(t), [t]);

  const actionMenuItems = useMemo<ActionMenuProps['menuItems']>(() => {
    const commonActions = [
      {
        label: t('settings:ppodSync.enterSyncCredentials'),
        icon: <EditIcon />,
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
    </Stack>
  );
}
