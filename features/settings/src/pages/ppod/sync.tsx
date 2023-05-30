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

import { useSyncRequests, ReturnTypeFromUseSyncRequests } from '../../api/ppod';

function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const getColumnDefs = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseSyncRequests>['columnDefs'] => [
  {
    field: 'requester',
    headerName: t('settings:ppodSync.completedBy'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseSyncRequests, any>) => {
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
    valueFormatter: ({ data }) =>
      data?.syncRequestStatus
        ? capitalizeFirstLetter(data?.syncRequestStatus)
        : '',
  },
];

export default function Sync() {
  const { t } = useTranslation(['common', 'settings']);
  const navigate = useNavigate();
  const { activeAcademicNamespace } = useAcademicNamespace();

  const startDate = activeAcademicNamespace?.startDate;
  const endDate = activeAcademicNamespace?.endDate;

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
