import { useMemo } from 'react';

import {
  PageContainer,
  PageHeading,
  Table,
  ICellRendererParams,
  RouterLink,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';

import { useTimetables, ReturnTypeFromUseTimeTables } from '../api/timetables';

const getColumnDefs = (
  t: TFunction<'timetable'[], undefined, 'timetable'[]>
) => [
  {
    field: 'timetableId',
    headerName: t('timetable:timetable'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseTimeTables>) =>
      data && (
        <RouterLink sx={{ fontWeight: 600 }} to={`./${data?.timetableId}`}>
          {data.timetableId}
        </RouterLink>
      ),
    sortable: true,
  },
  { field: 'name', headerName: t('timetable:period') },
];

export default function Timetables() {
  const { t } = useTranslation(['timetable', 'navigation']);
  const { data: timetables = [] } = useTimetables({});
  const columnDefs = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer title={t('navigation:management.timetable.timetables')}>
      <PageHeading
        title={t('navigation:management.timetable.timetables')}
        titleProps={{ variant: 'h3' }}
      />
      <Table
        rowData={timetables ?? []}
        columnDefs={columnDefs}
        getRowId={({ data }) => String(data.timetableId)}
      />
    </PageContainer>
  );
}
