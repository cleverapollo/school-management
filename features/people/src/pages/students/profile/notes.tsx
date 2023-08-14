import { useParams } from 'react-router-dom';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import {
  ActionMenu,
  getNumber,
  GridOptions,
  ICellRendererParams,
  PageHeading,
  Table,
  useDebouncedValue,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Box, Button, Chip } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { AddIcon, TrashIcon, VerticalDotsIcon } from '@tyro/icons';
import { useNotes } from '../../../api/note/list';
import {
  EditNoteModal,
  EditNoteModalProps,
} from '../../../components/students/note/edit-note-modal';
import {
  DeleteNoteConfirmModal,
  DeleteNoteConfirmModalProps,
} from '../../../components/students/note/delete-note-confirm-modal';

dayjs.extend(LocalizedFormat);

type ReturnTypeFromUseNotes = NonNullable<
  ReturnType<typeof useNotes>['data']
>[number];

const getStudentNoteColumns = (
  translate: TFunction<('common' | 'people')[]>,
  onClickEdit: Dispatch<SetStateAction<EditNoteModalProps['initialNoteState']>>,
  setNoteToDelete: Dispatch<
    SetStateAction<DeleteNoteConfirmModalProps['noteDetails']>
  >
): GridOptions<ReturnTypeFromUseNotes>['columnDefs'] => [
  {
    field: 'note',
    headerName: translate('people:note'),
    filter: true,
    sortable: true,
  },
  {
    field: 'tags',
    headerName: translate('people:labelsAndTags'),
    filter: true,
    sortable: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNotes, any>) =>
      data?.tags?.map((tag, idx) => (
        <Chip
          key={`note${data.id}-tag${idx}`}
          label={tag.name}
          variant="soft"
          sx={{ mr: 1 }}
        />
      )),
  },
  {
    field: 'createdOn',
    headerName: translate('common:date'),
    valueGetter: ({ data }) => dayjs(data?.createdOn).format('LL'),
    filter: true,
    sortable: true,
  },
  {
    field: 'createdBy',
    headerName: translate('common:createdBy'),
    filter: true,
    sortable: true,
  },
  {
    suppressColumnsToolPanel: true,
    sortable: false,
    cellClass: 'ag-show-on-row-interaction',
    cellRenderer: ({ data }: ICellRendererParams<ReturnTypeFromUseNotes>) =>
      data && (
        <ActionMenu
          iconOnly
          buttonIcon={<VerticalDotsIcon />}
          menuItems={[
            {
              label: translate('people:editNote'),
              onClick: () => onClickEdit(data),
            },
            {
              label: translate('common:actions.delete'),
              icon: <TrashIcon />,
              onClick: () => {
                setNoteToDelete(data);
              },
            },
          ]}
        />
      ),
  },
];

export default function StudentProfileNotesPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people']);

  const studentId = getNumber(id);
  const { data: notes = [] } = useNotes(studentId);

  const [selectedNotes, setSelectedNotes] = useState<ReturnTypeFromUseNotes[]>(
    []
  );
  const {
    value: noteDetails,
    debouncedValue: debouncedNoteDetails,
    setValue: setNoteDetails,
  } = useDebouncedValue<EditNoteModalProps['initialNoteState']>({
    defaultValue: undefined,
  });
  const {
    value: noteToDelete,
    debouncedValue: debouncedNoteToDelete,
    setValue: setNoteToDelete,
  } = useDebouncedValue<DeleteNoteConfirmModalProps['noteDetails']>({
    defaultValue: null,
  });

  const studentNoteColumns = useMemo(
    () => getStudentNoteColumns(t, setNoteDetails, setNoteToDelete),
    [t]
  );

  const handleCreateNote = () => {
    setNoteDetails({});
  };

  return (
    <>
      <PageHeading
        title=""
        titleProps={{ variant: 'h3' }}
        rightAdornment={
          <Box display="flex" alignItems="center">
            <Button
              variant="contained"
              onClick={handleCreateNote}
              startIcon={<AddIcon />}
            >
              {t('people:createNote')}
            </Button>
          </Box>
        }
      />
      <Table
        rowData={notes ?? []}
        columnDefs={studentNoteColumns}
        tableContainerSx={{ height: 300 }}
        rowSelection="multiple"
        getRowId={({ data }) => String(data?.id)}
        onRowSelection={(rows) => {
          setSelectedNotes(rows);
        }}
      />
      <EditNoteModal
        initialNoteState={noteDetails}
        onClose={() => setNoteDetails(undefined)}
      />
      <DeleteNoteConfirmModal
        open={!!noteToDelete}
        onClose={() => setNoteToDelete(null)}
        noteDetails={noteToDelete || debouncedNoteToDelete}
      />
    </>
  );
}
