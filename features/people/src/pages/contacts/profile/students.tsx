import { useParams } from 'react-router-dom';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  ReturnTypeDisplayName,
  StudyLevelSelectCellEditor,
  TableAvatar,
  useNumber,
} from '@tyro/core';
import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import set from 'lodash/set';
import { useContactStudents } from '../../../api';

type ReturnTypeFromUseContactStudents = NonNullable<
  ReturnType<typeof useContactStudents>['data']
>[number];

const getContactStudentsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseContactStudents>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents>) => {
      if (!data) return null;

      const student = data?.student;

      return (
        <TableAvatar
          name={displayName(student?.person) ?? ''}
          to={`/people/students/${student?.partyId ?? ''}`}
          avatarUrl={student?.person?.avatarUrl}
        />
      );
    },
    sort: 'asc',
  },
  {
    field: 'classes',
    headerName: 'Classes',
    filter: true,
    valueGetter: ({ data }) => '',
    enableRowGroup: true,
  },
  {
    field: 'relationship',
    headerName: 'Relationship',
    filter: true,
    editable: true,
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseContactStudents, any>) => null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: 'Is a Parent/Guardian',
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: 'Has Pick-up Permission',
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: 'Permission to View',
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: 'Include in school communication',
    valueGetter: ({ data }) => 'No',
    enableRowGroup: true,
  },
];

export default function ContactProfileStudentsPage() {
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { id } = useParams();
  const idNumber = useNumber(id);
  const { displayName } = usePreferredNameLayout();
  const { data: contactStudentsData } = useContactStudents(idNumber);
  console.log('data', contactStudentsData);

  const contactStudentColumns = useMemo(
    () => getContactStudentsColumns(t, displayName),
    [t, displayName]
  );

  return (
    <Table
      rowData={contactStudentsData ?? []}
      columnDefs={contactStudentColumns}
      getRowId={({ data }) => String(data?.studentPartyId)}
    />
  );
}
