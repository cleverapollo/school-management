import { GridOptions, Table } from '@tyro/core';
import { Reporting_TableFilterInput } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRunReports } from '../api/run-report';
import { DynamicForm } from '../components/dynamic-form';

type GenericReportData = Array<{ [key: string]: GenericReportDataCell }>;
type GenericReportDataCell = { value: any; colour: string };
type FormattedReportData = Array<{ [key: string]: GenericReportDataCell }>;

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

  const mainColumns = useMemo<
    GridOptions<FormattedReportData[number]>['columnDefs']
  >(() => {
    const fieldsColumns = reportData?.fields || [];
    return fieldsColumns.map((column) => {
      // @ts-ignore
      const valueGetter = ({ data }) => {
        if (data != null) {
          // @ts-ignore
          const value = data[column.id] as GenericReportDataCell;
          return value?.value;
        }
      };
      const mapped = {
        field: column.id,
        headerName: column.label,
        valueGetter,
        sortable: column.sortable,
        hide: !column.visibleByDefault,
        pinned: column.pinned ?? null,
        ...(column.hideMenu
          ? {
              suppressMenu: true,
            }
          : {
              filter: true,
              enableRowGroup: true,
            }),
      };
      if (column.maxWidth) {
        // @ts-ignore
        mapped.maxWidth = column.maxWidth;
      }
      return mapped;
    });
  }, [reportData?.fields]);

  const genericReportData = useMemo<FormattedReportData>(() => {
    const reportFieldsData = (reportData?.data || []) as GenericReportData;

    return reportFieldsData.reduce<FormattedReportData>(
      (reportFieldData, obj) => {
        const rowData = Object.keys(obj).reduce((row, key) => {
          row[key] ??= obj[key];
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
        gridOptions={{
          ...reportData?.tableDisplayOptions?.gridOptions,
        }}
        tableContainerSx={{
          ...reportData?.tableDisplayOptions?.tableContainerSx,
        }}
        getRowId={({ data }) => String(data?.id.value)}
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
