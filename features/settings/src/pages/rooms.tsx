import { Button, Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableBooleanValue,
} from '@tyro/core';
import { AddIcon } from '@tyro/icons';
import { useCoreRooms } from '../api/rooms';

type ReturnTypeFromUseCoreRooms = NonNullable<
  ReturnType<typeof useCoreRooms>['data']
>[number];

const getRoomColumns = (
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseCoreRooms>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
    editable: true,
    sort: 'asc',
  },
  {
    headerName: t('settings:capacity'),
    field: 'capacity',
    lockVisible: true,
  },
  {
    headerName: t('common:description'),
    field: 'description',
    lockVisible: true,
  },
  {
    headerName: t('common:location'),
    field: 'location',
    lockVisible: true,
  },
  {
    headerName: t('settings:active'),
    field: 'disabled',
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseCoreRooms, any>) => (
      <TableBooleanValue value={Boolean(!data?.disabled)} />
    ),
  },
  {
    headerName: t('settings:roomPool'),
    field: 'pools',
    lockVisible: true,
  },
];

export default function Rooms() {
  const { t } = useTranslation(['common', 'settings']);
  const { data: roomsList } = useCoreRooms();

  console.log('roomsList', roomsList);

  const roomColumns = useMemo(() => getRoomColumns(t), [t]);

  return (
    <Page title={t('settings:rooms')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('settings:rooms')}
        </Typography>
        <Table
          rowData={roomsList ?? []}
          columnDefs={roomColumns}
          getRowId={({ data }) => String(data?.roomId)}
          rightAdornment={
            <Button variant="text" endIcon={<AddIcon />}>
              {t('settings:actions.addNewRoom')}
            </Button>
          }
        />
      </Container>
    </Page>
  );
}
