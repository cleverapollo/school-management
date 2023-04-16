import { Button, Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { useMemo } from 'react';
import { GridOptions, Page, Table } from '@tyro/core';
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
    editable: true,
    cellEditor: 'agNumericCellEditor',
    valueParser: (params) => {
      const value = Number(params.newValue);
      return Number.isNaN(value)
        ? (params.oldValue as NonNullable<ReturnTypeFromUseCoreRooms>['capacity'])
        : value;
    },
  },
];

export default function Rooms() {
  const { t } = useTranslation(['common', 'settings']);
  const { data: roomsList } = useCoreRooms();

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
