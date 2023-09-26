import { Table } from '@tyro/core';
import { Reporting_TableFilterInput } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useRunReports } from '../api/run-report';
import { DynamicForm } from '../components/dynamic-form';

type GenericReportData = Array<{ [key: string]: { value: any } }>;
type FormattedReportData = Array<{ [key: string]: any } & { id: number }>;

export default function ReportPage() {
  const { id = '', reportId = '' } = useParams();
  const [filters, setFilters] = useState<Reporting_TableFilterInput[]>();

  const {
    data: reportData,
    isFetching,
    isLoading,
  } = useRunReports({
    topReportId: id,
    filter: {
      reportId,
      filters,
    },
  });

  const mainColumns = useMemo(() => {
    const fieldsColumns = reportData?.fields || [];

    return fieldsColumns.map((column) => ({
      field: column.id,
      headerName: column.label,
      hide: !column.visibleByDefault,
    }));
  }, [reportData?.fields]);

  const genericReportData = useMemo<FormattedReportData>(() => {
    const reportFieldsData = (reportData?.data || []) as GenericReportData;

    return reportFieldsData.reduce<FormattedReportData>(
      (reportFieldData, obj) => {
        const rowData = Object.keys(obj).reduce((row, key) => {
          row[key] ??= obj[key].value;
          return row;
        }, {} as FormattedReportData[number]);

        return [...reportFieldData, rowData];
      },
      []
    );
  }, [reportData?.data]);

  return (
    <>
      <DynamicForm
        isFetching={isFetching}
        filters={reportData?.filters || []}
        onFilterChange={setFilters}
      />
      <Table<FormattedReportData[number]>
        isLoading={isLoading}
        rowData={genericReportData}
        columnDefs={mainColumns}
        getRowId={({ data }) => String(data?.id)}
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
    </>
  );
}
