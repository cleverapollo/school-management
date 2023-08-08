import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import {
  getNumber,
  GridOptions,
  ICellRendererParams,
  PageHeading,
  Table,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Box, Button, Chip } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { AddIcon } from '@tyro/icons';
import { useNotes } from '../../../api/note/list';

dayjs.extend(LocalizedFormat);

type ReturnTypeFromUseNotes = NonNullable<
  ReturnType<typeof useNotes>['data']
>[number];

const getStudentNoteColumns = (
  translate: TFunction<('common' | 'people')[]>
): GridOptions<ReturnTypeFromUseNotes>['columnDefs'] => [
  {
    field: 'note',
    headerName: translate('people:note'),
  },
  {
    field: 'tags',
    headerName: translate('people:labelsAndTags'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNotes, any>) =>
      data?.tags?.map((tag, idx) => (
        <Chip
          key={`note${data.id}-tag${idx}`}
          label={translate(`common:noteTagCategory.${tag.category}`)}
          variant="soft"
        />
      )),
  },
  {
    field: 'createdOn',
    headerName: translate('common:date'),
    valueGetter: ({ data }) => dayjs(data?.createdOn).format('LL'),
  },
  {
    field: 'createdBy',
    headerName: translate('common:createdBy'),
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

  const studentNoteColumns = useMemo(() => getStudentNoteColumns(t), [t]);

  const handleCreateNote = () => {};

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
    </>
  );
}
