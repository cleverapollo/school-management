import { useParams } from 'react-router-dom';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  getNumber,
  GridOptions,
  ICellRendererParams,
  Table,
  useDebouncedValue,
  ReturnTypeDisplayName,
  usePreferredNameLayout,
  TableSwitch,
  TableBooleanValue,
  BulkEditedRows,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Box, Button, Chip, Stack } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { AddIcon, EditIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import { getColorBasedOnIndex, Notes_UpsertNote } from '@tyro/api';
import { ReturnTypeFromUseNotes, useNotes } from '../../../api/note/list';
import {
  EditNoteModal,
  EditNoteModalProps,
} from '../../../components/students/note/edit-note-modal';
import {
  DeleteNoteConfirmModal,
  DeleteNoteConfirmModalProps,
} from '../../../components/students/note/delete-note-confirm-modal';
import { useUpsertNote } from '../../../api/note/upsert-note';

dayjs.extend(LocalizedFormat);

const getStudentNoteColumns = (
  translate: TFunction<('common' | 'people')[]>,
  displayName: ReturnTypeDisplayName,
  onEdit: Dispatch<SetStateAction<EditNoteModalProps['initialState']>>,
  onDelete: Dispatch<SetStateAction<DeleteNoteConfirmModalProps['noteDetails']>>
): GridOptions<ReturnTypeFromUseNotes>['columnDefs'] => [
  {
    field: 'note',
    headerName: translate('people:note'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    width: 400,
    cellStyle: {
      lineHeight: 2,
      paddingTop: 12,
      paddingBottom: 12,
      wordBreak: 'break-word',
    },
  },
  {
    field: 'tags',
    headerName: translate('common:label'),
    filter: true,
    sortable: true,
    autoHeight: true,
    wrapText: true,
    width: 300,
    valueGetter: ({ data }) => data?.tags?.map(({ name }) => name),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNotes, any>) =>
      data?.tags ? (
        <Stack direction="row" gap={1} my={1} flexWrap="wrap">
          {data.tags.map(({ id, name }) => (
            <Chip
              key={id}
              label={name}
              variant="soft"
              color={getColorBasedOnIndex(id)}
            />
          ))}
        </Stack>
      ) : null,
  },
  {
    field: 'createdOn',
    headerName: translate('common:date'),
    valueGetter: ({ data }) => dayjs(data?.createdOn).format('LL'),
    filter: true,
    sortable: true,
    suppressSizeToFit: true,
    sort: 'desc',
    comparator: (dateA: string, dateB: string) =>
      dayjs(dateA).unix() - dayjs(dateB).unix(),
  },
  {
    field: 'createdByPerson',
    headerName: translate('common:createdBy'),
    valueGetter: ({ data }) =>
      data ? displayName(data.createdByPerson) : null,
    filter: true,
    sortable: true,
    suppressSizeToFit: true,
  },
  {
    field: 'priorityNote',
    headerName: translate('people:priority'),
    editable: true,
    cellClass: ['ag-editable-cell', 'disable-cell-edit-style'],
    cellEditor: TableSwitch,
    valueGetter: ({ data }) => data?.priorityNote,
    valueFormatter: ({ data }) =>
      data?.priorityNote ? translate('common:yes') : translate('common:no'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNotes, any>) => (
      <TableBooleanValue value={Boolean(data?.priorityNote)} />
    ),
  },
  {
    suppressColumnsToolPanel: true,
    cellClass: 'ag-show-on-row-interaction',
    sortable: false,
    suppressSizeToFit: true,
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseNotes>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: translate('people:editNote'),
              icon: <EditIcon />,
              onClick: () => onEdit(data),
            },
            {
              label: translate('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => onDelete(data),
            },
          ]}
        />
      ),
  },
];

export default function StudentProfileNotesPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people']);

  const { displayName } = usePreferredNameLayout();

  const studentId = getNumber(id);
  const { data: notes = [] } = useNotes({
    partyIds: [studentId ?? 0],
  });
  const { mutate: createOrUpdateNoteMutation } = useUpsertNote();

  const [noteDetails, setNoteDetails] =
    useState<EditNoteModalProps['initialState']>(null);

  const {
    value: noteToDelete,
    debouncedValue: debouncedNoteToDelete,
    setValue: setNoteToDelete,
  } = useDebouncedValue<DeleteNoteConfirmModalProps['noteDetails']>({
    defaultValue: null,
  });

  const studentNoteColumns = useMemo(
    () =>
      getStudentNoteColumns(t, displayName, setNoteDetails, setNoteToDelete),
    [t]
  );

  const handleBulkSave = (
    data: BulkEditedRows<ReturnTypeFromUseNotes, any>
  ) => {
    const updates = Object.entries(data).reduce<Notes_UpsertNote[]>(
      (acc, [partyId, changes]) => {
        const noteRow = notes.find((note) => note.id === Number(partyId));
        const priorityNote = changes?.priorityNote?.newValue;
        const priorityNoteUpdateInput = {
          priorityNote: Boolean(priorityNote),
          id: Number(partyId),
          tags: noteRow?.tags?.map((tag) => tag.id),
          referencedParties: [studentId],
        };

        return [...acc, priorityNoteUpdateInput];
      },
      []
    );

    return createOrUpdateNoteMutation(updates);
  };

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => setNoteDetails({})}
          startIcon={<AddIcon />}
        >
          {t('people:createNote')}
        </Button>
      </Box>
      <Table
        rowData={notes ?? []}
        columnDefs={studentNoteColumns}
        tableContainerSx={{ height: 300 }}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onBulkSave={handleBulkSave}
      />
      {noteDetails && (
        <EditNoteModal
          studentId={studentId!}
          initialState={noteDetails}
          onClose={() => setNoteDetails(null)}
        />
      )}
      <DeleteNoteConfirmModal
        open={!!noteToDelete}
        noteDetails={debouncedNoteToDelete}
        onClose={() => setNoteToDelete(null)}
      />
    </>
  );
}
