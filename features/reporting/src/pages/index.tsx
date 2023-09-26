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

const getColumns = (
  t: TFunction<'common'[], undefined>
): GridOptions<ReturnTypeFromUseReportsList>['columnDefs'] => [
  {
    field: 'info.name',
    headerName: t('common:name'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseReportsList, any>) =>
      data ? (
        <Link
          fontWeight={600}
          to={`/reports/${data.info.id}/${data.reports?.[0]?.id}`}
        >
          {data.info.name}
        </Link>
      ) : null,
  },
];

export default function ReportsListPage() {
  const { t } = useTranslation(['common', 'reports']);

  const { data: reportsData = [] } = useReportsList();
  const columns = useMemo(() => getColumns(t), [t]);

  const title = t('reports:list');

  return (
    <PageContainer title={title}>
      <PageHeading title={title} titleProps={{ variant: 'h3' }} />
      <Table
        rowData={reportsData}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.info?.id)}
      />
    </PageContainer>
  );
}
