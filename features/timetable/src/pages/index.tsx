import { useMemo } from 'react';
import { Container, Typography } from '@mui/material';

import { Page, Table, ICellRendererParams, RouterLink } from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';

import {
  useTimetableLesson,
  ReturnTypeFromUseTimeTableLesson,
} from '../api/timetable';

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
    <Page title={t('navigation:general.timetable')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('navigation:general.timetable')}
        </Typography>
        <Table
          rowData={timetables ?? []}
          columnDefs={columnDefs}
          getRowId={({ data }) => String(data.timetableId)}
        />
      </Container>
    </Page>
  );
}
