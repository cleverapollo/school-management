import { useMemo } from 'react';
import { useParams } from 'react-router';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  useNumber,
  Table,
  GridOptions,
  TablePersonAvatar,
  ICellRendererParams,
  usePreferredNameLayout,
  ReturnTypeDisplayName,
} from '@tyro/core';
import {
  useCustomGroupDefinition,
  ReturnTypeFromUseCustomGroupDefinition,
} from '../../../api';

type CustomGroupStudent =
  ReturnTypeFromUseCustomGroupDefinition['students'][number];

const getColumns = (
  t: TFunction<'common'[], undefined, 'common'[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<CustomGroupStudent>['columnDefs'] => [
  {
    field: 'person',
    headerName: t('common:name'),
    sort: 'asc',
    valueGetter: ({ data }) => displayName(data?.person),
    cellRenderer: ({ data }: ICellRendererParams<CustomGroupStudent>) =>
      data && (
        <TablePersonAvatar
          person={data?.person}
          to={`/people/students/${data?.partyId ?? ''}`}
        />
      ),
  },
  {
    field: 'classGroup.name',
    headerName: t('common:classGroup'),
    enableRowGroup: true,
    valueGetter: ({ data }) => data?.classGroup?.name || '-',
  },
];

export default function CustomGroupStudentsPage() {
  const { t } = useTranslation(['common', 'people']);
  const { displayName } = usePreferredNameLayout();

  const { groupId } = useParams();
  const partyId = useNumber(groupId) ?? 0;

  const { data: customGroupData } = useCustomGroupDefinition({ partyId });

  const columns = useMemo(() => getColumns(t, displayName), [t, displayName]);

  return (
    <Table
      rowData={customGroupData?.students ?? []}
      columnDefs={columns}
      getRowId={({ data }) => String(data?.person?.partyId)}
    />
  );
}
