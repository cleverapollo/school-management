import { useMemo, useState } from 'react';
import {
  GridOptions,
  ICellRendererParams,
  PageContainer,
  PageHeading,
  ReturnTypeDisplayName,
  Table,
  usePreferredNameLayout,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import { Reporting_TableFilter, Reporting_TableFilterInput } from '@tyro/api';
import {
  useAttendanceAwolReports,
  ReturnTypeFromUseAttendanceAwolReports,
} from '../api/awol-report';
import { DynamicForm } from '../components/dynamic-form';
import { useAwolReportFilters } from '../hooks/use-awol-report-filters';

const getColumns = (
  t: TFunction<('common' | 'reports')[], undefined, ('common' | 'reports')[]>,
  displayName: ReturnTypeDisplayName
): GridOptions<ReturnTypeFromUseAttendanceAwolReports>['columnDefs'] => [
  {
    headerName: t('common:name'),
    field: 'student',
    valueGetter: ({ data }) => displayName(data?.student?.person),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceAwolReports, any>) =>
      displayName(data?.student?.person) || '-',
    sort: 'asc',
  },
  {
    headerName: t('common:class'),
    field: 'classGroup.name',
    valueGetter: ({ data }) => data?.classGroup?.name || '-',
    filter: true,
  },
  {
    headerName: t('common:date'),
    field: 'date',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceAwolReports, any>) =>
      data?.date ? dayjs(data?.date).format('L') : '-',
  },
  {
    headerName: t('reports:absentFrom'),
    field: 'absentEvent',
    valueGetter: ({ data }) => data?.absentEvent?.name || '-',
  },
  {
    colId: 'absentTakenTime',
    headerName: t('common:time'),
    valueGetter: ({ data }) =>
      (data?.absentEvent?.startTime && data?.absentEvent?.endTime) || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceAwolReports, any>) => {
      const start = dayjs(data?.absentEvent?.startTime).format('HH:mm');
      const end = dayjs(data?.absentEvent?.endTime).format('HH:mm');
      return `${start} - ${end}`;
    },
  },
  {
    headerName: t('common:takenBy'),
    colId: 'absentTakenBy',
    valueGetter: ({ data }) => data?.absentUpdatedBy || data?.absentCreatedBy,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceAwolReports, any>) =>
      displayName(data?.absentUpdatedBy || data?.absentCreatedBy) || '-',
  },
  {
    headerName: t('reports:lastPresentIn'),
    field: 'presentEvent.name',
    valueGetter: ({ data }) => data?.presentEvent?.name || '-',
  },
  {
    colId: 'presentTakenTime',
    headerName: t('common:time'),
    valueGetter: ({ data }) => data?.presentEvent || '-',
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceAwolReports, any>) => {
      const start = dayjs(data?.presentEvent?.startTime).format('HH:mm');
      const end = dayjs(data?.presentEvent?.endTime).format('HH:mm');
      return start && end ? `${start} - ${end}` : '-';
    },
  },
  {
    headerName: t('common:takenBy'),
    colId: 'presentTakenBy',
    valueGetter: ({ data }) => data?.presentUpdatedBy,
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseAttendanceAwolReports, any>) =>
      displayName(data?.presentUpdatedBy || data?.presentCreatedBy) || '-',
  },
];

export default function AwolStudentsPage() {
  const { t } = useTranslation(['common', 'reports']);
  const { displayName } = usePreferredNameLayout();
  const awolReportsFilters = useAwolReportFilters();

  const [filters, setFilters] = useState<Reporting_TableFilterInput[]>(
    awolReportsFilters?.map((filter) => ({
      filterId: filter.id,
      filterValue: filter.defaultValue,
    }))
  );

  const {
    data: reports = [],
    isFetching,
    isLoading,
  } = useAttendanceAwolReports({
    from: filters[0].filterValue,
    to: filters[1].filterValue,
  });

  const columns = useMemo(() => getColumns(t, displayName), [t, displayName]);

  const reportName = t('reports:awolStudents');

  return (
    <PageContainer title={reportName}>
      <PageHeading
        title={reportName}
        breadcrumbs={{
          links: [
            {
              name: t('reports:list'),
              href: './..',
            },
            {
              name: reportName,
            },
          ],
        }}
      />
      <DynamicForm
        isFetching={isFetching}
        filters={awolReportsFilters || []}
        onFilterChange={setFilters}
      />
      <Table
        isLoading={isLoading}
        rowData={reports}
        columnDefs={columns}
        getRowId={({ data }) => `${data?.partyId}-${data?.date}`}
        statusBar={{
          statusPanels: [
            {
              statusPanel: 'agTotalAndFilteredRowCountComponent',
              align: 'left',
            },
            { statusPanel: 'agFilteredRowCountComponent' },
            { statusPanel: 'agSelectedRowCountComponent' },
          ],
        }}
      />
    </PageContainer>
  );
}
