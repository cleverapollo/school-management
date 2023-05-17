import { useParams } from 'react-router-dom';
import { useMemo } from 'react';
import { TFunction, useTranslation } from '@tyro/i18n';
import {
  GridOptions,
  Table,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
  TableStudyLevelChip,
  StudyLevelSelectCellEditor,
  TableAvatar,
  getNumber,
} from '@tyro/core';

import set from 'lodash/set';
import { useStudentsSubjectGroups } from '../../../api/student';

type ReturnTypeFromUseStudentsSubjectGroups = NonNullable<
  ReturnType<typeof useStudentsSubjectGroups>['data']
>[number];

const getSubjectGroupsColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayNames: ReturnTypeDisplayNames
): GridOptions<ReturnTypeFromUseStudentsSubjectGroups>['columnDefs'] => [
  {
    field: 'name',
    headerName: t('common:name'),
    lockVisible: true,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups>) => {
      if (!data) return null;

      const subject = data?.subjects?.[0] ?? null;
      const bgColorStyle = subject?.colour
        ? { bgcolor: `${subject.colour}.500` }
        : {};
      return (
        <TableAvatar
          name={data?.name ?? ''}
          to={`./${data?.partyId ?? ''}`}
          avatarUrl={data?.avatarUrl}
          AvatarProps={{
            sx: {
              borderRadius: 1,
              ...bgColorStyle,
            },
          }}
        />
      );
    },
    sort: 'asc',
  },
  {
    field: 'subjects',
    headerName: t('common:subject'),
    filter: true,
    valueGetter: ({ data }) => {
      const [firstSubject] = data?.subjects || [];
      return firstSubject?.name;
    },
    enableRowGroup: true,
  },
  {
    field: 'irePP.level',
    headerName: t('common:level'),
    filter: true,
    editable: true,
    valueSetter: (params) => {
      set(params.data ?? {}, 'irePP.level', params.newValue);
      return true;
    },
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseStudentsSubjectGroups, any>) =>
      data?.irePP?.level ? (
        <TableStudyLevelChip level={data.irePP.level} />
      ) : null,
    cellEditorSelector: StudyLevelSelectCellEditor(t),
    enableRowGroup: true,
  },
  {
    field: 'staff',
    headerName: t('common:teacher'),
    valueGetter: ({ data }) => displayNames(data?.staff),
    enableRowGroup: true,
  },
];

export default function StudentProfileClassesPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const { t } = useTranslation(['common', 'groups', 'people', 'mail']);
  const { displayNames } = usePreferredNameLayout();

  const { data: subjectGroupsData } = useStudentsSubjectGroups(studentId);

  const studentColumns = useMemo(
    () => getSubjectGroupsColumns(t, displayNames),
    [t, displayNames]
  );

  return (
    <Table
      rowData={subjectGroupsData ?? []}
      columnDefs={studentColumns}
      getRowId={({ data }) => String(data?.partyId)}
    />
  );
}
