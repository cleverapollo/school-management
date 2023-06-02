import { useMemo } from 'react';

import {
  PageContainer,
  PageHeading,
  Table,
  ICellRendererParams,
  RouterLink,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  useTimetableLesson,
  ReturnTypeFromUseTimeTableLesson,
} from '../api/timetable-lessons';

const getColumnDefs = (
  t: TFunction<'timetable'[], undefined, 'timetable'[]>
) => [
  {
    field: 'timetableId',
    headerName: t('timetable:timetable'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseTimeTableLesson>) =>
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
  const { data: timetables = [] } = useTimetableLesson();
  const columnDefs = useMemo(() => getColumnDefs(t), [t]);

  return (
    <PageContainer title={t('navigation:general.timetable')}>
      <PageHeading
        title={t('navigation:general.timetable')}
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
