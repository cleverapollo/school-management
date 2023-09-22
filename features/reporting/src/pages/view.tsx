import { PageContainer, PageHeading, Table } from '@tyro/core';
import { Reporting_TableFilterInput } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '@tyro/i18n';

import { useRunReports } from '../api/run-report';
import { DynamicForm } from '../components/dynamic-form';

export default function ReportPage() {
  const { t } = useTranslation(['reports']);

  const { id = '' } = useParams();
  const [filters, setFilters] = useState<Reporting_TableFilterInput[]>();

  const {
    data: reportData,
    isFetching,
    isLoading,
  } = useRunReports({
    reportId: id,
    filters,
  });

  const columns = useMemo(
    () =>
      (reportData?.fields || []).map((column) => ({
        field: column.id,
        headerName: column.label,
        hide: !column.visibleByDefault,
      })),
    [reportData?.fields]
  );

  const reportName = reportData?.info.name || '';

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
        filters={reportData?.filters || []}
        onFilterChange={setFilters}
      />
      <Table
        isLoading={isLoading}
        rowData={reportData?.data ?? []}
        columnDefs={columns}
        getRowId={({ data }) => String((data as { id: number })?.id)}
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
