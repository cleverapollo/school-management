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
    field: 'name',
    headerName: t('common:name'),
    cellRenderer: ({
      data,
    }: ICellRendererParams<ReturnTypeFromUseReportsList, any>) =>
      data ? (
        <Link fontWeight={600} to={`/reports-list/${data.id}`}>
          {data.name}
        </Link>
      ) : null,
  },
];

export default function ReportsListPage() {
  const { t } = useTranslation(['common']);

  const { data: reportsData = [] } = useReportsList();
  const columns = useMemo(() => getColumns(t), [t]);

  return (
    <PageContainer title="Reports list">
      <PageHeading title="Reports list" titleProps={{ variant: 'h3' }} />
      <Table
        rowData={reportsData}
        columnDefs={columns}
        getRowId={({ data }) => String(data?.id)}
      />
    </PageContainer>
  );
}
