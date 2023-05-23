import { Button, Container, Typography } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  Page,
  Table,
  TableBooleanValue,
} from '@tyro/core';
import {
  AddIcon,
  EditIcon,
  ExternalLinkIcon,
  VerticalDotsIcon,
} from '@tyro/icons';
import { useCoreRooms } from '../api/rooms';
import {
  EditRoomDetailsModal,
  EditRoomFormState,
} from '../components/edit-room-details-modal';

type ReturnTypeFromUseCoreRooms = NonNullable<
  ReturnType<typeof useCoreRooms>['data']
>[number];

const getRoomColumns = (
  onClickEdit: Dispatch<SetStateAction<Partial<EditRoomFormState> | null>>,
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
      <TableBooleanValue value={!data?.disabled} />
    ),
  },
  {
    headerName: t('settings:roomPool'),
    field: 'pools',
    lockVisible: true,
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseCoreRooms>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: t('settings:actions.editRoom'),
              icon: <EditIcon />,
              onClick: () => onClickEdit(data),
            },
            {
              label: t('settings:actions.linkToViewRoomTimetable'),
              icon: <ExternalLinkIcon />,
              onClick: () => {},
            },
          ]}
        />
      ),
  },
];

export default function Rooms() {
  const { t } = useTranslation(['common', 'settings']);
  const { data: roomsList } = useCoreRooms();
  const [editRoomInitialState, setEditRoomInitialState] =
    useState<Partial<EditRoomFormState> | null>(null);

  const handleAddRoom = () => {
    setEditRoomInitialState({});
  };

  const handleCloseEditModal = () => {
    setEditRoomInitialState(null);
  };

  const roomColumns = useMemo(
    () => getRoomColumns(setEditRoomInitialState, t),
    [editRoomInitialState, t]
  );
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
            <Button
              variant="text"
              onClick={handleAddRoom}
              endIcon={<AddIcon />}
            >
              {t('settings:actions.addNewRoom')}
            </Button>
          }
        />
        <EditRoomDetailsModal
          initialRoomState={editRoomInitialState}
          onClose={handleCloseEditModal}
        />
      </Container>
    </Page>
  );
}
