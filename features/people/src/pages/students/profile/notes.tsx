import { useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { getNumber, GridOptions, ICellRendererParams, Table } from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { Chip } from '@mui/material';
import { useStudentsNotes } from '../../../api/student/overview';

type ReturnTypeFromUseNotes = NonNullable<
  ReturnType<typeof useStudentsNotes>['data']
>[number];

const getStudentNoteColumns = (
  translate: TFunction<('common' | 'people')[]>
): GridOptions<ReturnTypeFromUseNotes>['columnDefs'] => [
  {
    field: 'note',
    headerName: translate('common:note'),
  },
  {
    field: 'tags',
    headerName: translate('common:labelsAndTags'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseNotes, any>) =>
      data.tags.map((tag, idx) => (
        <Chip
          key={`note${data.id}-tag${idx}`}
          label={translate(`common:noteTagCategory.${tag.category}`)}
          variant="soft"
        />
      )),
  },
];

export default function StudentProfileNotesPage() {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'people', 'mail', 'sms']);

  const studentId = getNumber(id);
  const { data: notes = [] } = useStudentsNotes(studentId);

  const [selectedNotes, setSelectedNotes] = useState<ReturnTypeFromUseNotes[]>(
    []
  );

  const studentNoteColumns = useMemo(() => getStudentNoteColumns(t), [t]);

  return (
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
  );
}
