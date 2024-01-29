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
import { getPersonProfileLink, Reporting_TableFilterInput } from '@tyro/api';
import { StudentTableAvatar } from '@tyro/people';
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
    }: ICellRendererParams<ReturnTypeFromUseAttendanceAwolReports, any>) => {
      if (!data) return null;

      const personProfilePageLink = getPersonProfileLink(data?.student?.person);
      const linkWithTab = personProfilePageLink
        ? `${personProfilePageLink}/attendance`
        : null;

      return (
        <StudentTableAvatar
          person={data?.student?.person}
          isPriorityStudent={data.student?.extensions?.priority || false}
          hasSupportPlan={false}
          to={linkWithTab}
        />
      );
    },
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
    valueGetter: ({ data }) =>
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
    valueGetter: ({ data }) => {
      const startTime = data?.absentEvent?.startTime;
      const endTime = data?.absentEvent?.endTime;
      if (!startTime || !endTime) return '-';

      const start = dayjs(startTime).format('HH:mm');
      const end = dayjs(endTime).format('HH:mm');
      return `${start} - ${end}`;
    },
  },
  {
    headerName: t('common:takenBy'),
    colId: 'absentTakenBy',
    valueGetter: ({ data }) => {
      const takenBy = data?.absentUpdatedBy || data?.absentCreatedBy;
      return takenBy ? displayName(takenBy) : '-';
    },
  },
  {
    headerName: t('reports:lastPresentIn'),
    field: 'presentEvent.name',
    valueGetter: ({ data }) => data?.presentEvent?.name || '-',
  },
  {
    colId: 'presentTakenTime',
    headerName: t('common:time'),
    valueGetter: ({ data }) => {
      const startTime = data?.presentEvent?.startTime;
      const endTime = data?.presentEvent?.endTime;
      if (!startTime || !endTime) return '-';

      const start = dayjs(startTime).format('HH:mm');
      const end = dayjs(endTime).format('HH:mm');
      return `${start} - ${end}`;
    },
  },
  {
    headerName: t('common:takenBy'),
    colId: 'presentTakenBy',
    valueGetter: ({ data }) => {
      const takenBy = data?.presentUpdatedBy || data?.presentCreatedBy;
      return takenBy ? displayName(takenBy) : '-';
    },
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
        onValueChange={(newValue) => setFilters(newValue.filters)}
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
