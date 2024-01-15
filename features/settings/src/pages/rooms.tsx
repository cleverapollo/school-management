import { Button, Box } from '@mui/material';
import { useTranslation, TFunction } from '@tyro/i18n';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  Table,
  TableBooleanValue,
  commonActionMenuProps,
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
  EditRoomDetailsViewProps,
} from '../components/edit-room-details-modal';

export type ReturnTypeFromUseCoreRooms = NonNullable<
  ReturnType<typeof useCoreRooms>['data']
>[number];

const getRoomColumns = (
  onClickEdit: Dispatch<
    SetStateAction<EditRoomDetailsViewProps['initialRoomState']>
  >,
  t: TFunction<('common' | 'settings')[], undefined, ('common' | 'settings')[]>
): GridOptions<ReturnTypeFromUseCoreRooms>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'name',
    lockVisible: true,
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
    ...commonActionMenuProps,
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
    useState<EditRoomDetailsViewProps['initialRoomState']>(null);

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
    <PageContainer title={t('settings:rooms')}>
      <PageHeading
        title={t('settings:rooms')}
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleAddRoom}
              startIcon={<AddIcon />}
            >
              {t('settings:actions.addNewRoom')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={roomsList ?? []}
        columnDefs={roomColumns}
        getRowId={({ data }) => String(data?.roomId)}
      />
      <EditRoomDetailsModal
        rooms={roomsList ?? []}
        initialRoomState={editRoomInitialState}
        onClose={handleCloseEditModal}
      />
    </PageContainer>
  );
}
