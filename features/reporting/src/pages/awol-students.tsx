import { useMemo } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  ReturnTypeDisplayName,
  Table,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import {
  useAwolReports,
  ReturnTypeFromUseAwolReports,
} from '../api/awol-report';

const getColumns = (
  t: TFunction<('common' | 'reports')[], undefined, ('common' | 'reports')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseAwolReports>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'student',
    valueGetter: ({ data }) => displayName(data?.student?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAwolReports, any>) =>
      displayName(data?.student?.person) || '-',
    sort: 'asc',
  },
  {
    headerName: t('common:class'),
    field: 'classGroup.name',
    valueGetter: ({ data }) => data?.classGroup?.name || '-',
  },
  {
    headerName: t('common:date'),
    field: 'date',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAwolReports, any>) =>
      data?.date ? dayjs(data?.date).format('L') : '-',
  },
  {
    headerName: t('reports:absentFrom'),
    field: 'absentEvent',
    valueGetter: ({ data }) => data?.absentEvent?.name || '-',
  },
  {
    headerName: t('common:time'),
    valueGetter: ({ data }) =>
      (data?.absentEvent?.startTime && data?.absentEvent?.endTime) || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAwolReports, any>) => {
      const start = dayjs(data?.absentEvent?.startTime).format('HH:mm');
      const end = dayjs(data?.absentEvent?.endTime).format('HH:mm');
      return `${start} - ${end}`;
    },
  },
  {
    headerName: t('common:teacher'),
    field: 'absentMarkedBy',
    valueGetter: ({ data }) => data?.absentMarkedBy,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAwolReports, any>) =>
      displayName(data?.absentMarkedBy) || '-',
  },
  {
    headerName: t('reports:lastPresentIn'),
    field: 'presentEvent.name',
    valueGetter: ({ data }) => data?.presentEvent?.name || '-',
  },
  {
    colId: 'time',
    headerName: t('common:time'),
    valueGetter: ({ data }) => data?.presentEvent || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAwolReports, any>) => {
      const start = dayjs(data?.presentEvent?.startTime).format('HH:mm');
      const end = dayjs(data?.presentEvent?.endTime).format('HH:mm');
      return start && end ? `${start} - ${end}` : '-';
    },
  },
  {
    headerName: t('common:teacher'),
    field: 'presentMarkedBy',
    valueGetter: ({ data }) => data?.presentMarkedBy,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAwolReports, any>) =>
      displayName(data?.presentMarkedBy) || '-',
  },
];

export default function AwolStudentsPage() {
  const { t } = useTranslation(['common', 'reports']);
  const { displayName } = usePreferredNameLayout();

  const currentDay = dayjs().format('YYYY-MM-DD');

  const { data: reports = [], isLoading } = useAwolReports({
    date: '2023-10-17',
    // date: currentDay,
  });

  const columns = useMemo(() => getColumns(t, displayName), [t, displayName]);

  return (
    <Table
      isLoading={isLoading}
      rowData={reports}
      columnDefs={columns}
      getRowId={({ data }) => String(data?.partyId)}
    />
  );
}
