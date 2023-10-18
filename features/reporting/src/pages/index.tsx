import {
  GridOptions,
  ICellRendererParams,
  Link,
  PageContainer,
  PageHeading,
  Table,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { ReturnTypeFromUseReportsList, useReportsList } from '../api/list';
import { getAttendanceAwolReportsInfo } from '../utils/get-awol-reports-info';

const getColumns = (
  t: TFunction<'common'[], undefined>
): GridOptions<ReturnTypeFromUseReportsList>['columnDefs'] => [
  {
    field: 'info.name',
    headerName: t('common:name'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseReportsList, any>) => {
      if (!data) return null;

      const isAwolStudent = data?.info?.name === 'AWOL Students';
      const attendanceAwolReportsData = getAttendanceAwolReportsInfo(t);

      return isAwolStudent ? (
        <Link
          fontWeight={600}
          to={`/reports/${attendanceAwolReportsData?.info?.id}/${attendanceAwolReportsData?.reports?.[0]?.id}`}
        >
          {' '}
          {attendanceAwolReportsData?.info?.name}
        </Link>
      ) : (
        <Link
          fontWeight={600}
          to={`/reports/${data?.info.id}/${data?.reports?.[0]?.id}`}
        >
          {data?.info.name}
        </Link>
      );
    },
    sort: 'asc',
  },
];

export default function ReportsListPage() {
  const { t } = useTranslation(['common', 'reports']);

  const { data: reportsData = [] } = useReportsList();
  const attendanceAwolReportsData = getAttendanceAwolReportsInfo(t);
  const updatedReportsData = [...reportsData, attendanceAwolReportsData];

  const columns = useMemo(() => getColumns(t), [t]);

  const title = t('reports:list');

  return (
    <PageContainer title={title}>
      <PageHeading title={title} titleProps={{ variant: 'h3' }} />
      <Table
        rowData={updatedReportsData}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.info?.id)}
      />
    </PageContainer>
  );
}
