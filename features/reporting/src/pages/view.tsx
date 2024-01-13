import { GridOptions, Table } from '@tyro/core';
import { Reporting_TableFilterInput } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Color, Palette, useTheme } from '@mui/material';
import { useRunReports } from '../api/run-report';
import { DynamicForm } from '../components/dynamic-form';

type GenericReportData = Array<{ [key: string]: GenericReportDataCell }>;
type GenericReportDataCell = { value: any; colour: string };
type FormattedReportData = Array<{ [key: string]: GenericReportDataCell }>;

const getFiltersFromSearchParams = (
  searchParams: URLSearchParams
): Reporting_TableFilterInput[] =>
  Array.from(searchParams.entries()).map(([filterId, filterValue]) => {
    let formattedFilterValue: string | number | Array<string | number> =
      filterValue;

    if (formattedFilterValue.includes(',')) {
      formattedFilterValue = formattedFilterValue
        .split(',')
        .map((value: string) =>
          Number.isNaN(Number(value)) ? String(value) : Number(value)
        );
    } else if (!Number.isNaN(Number(formattedFilterValue))) {
      formattedFilterValue = Number(formattedFilterValue);
    }

    return {
      filterId,
      filterValue: formattedFilterValue,
    };
  }) ?? [];

export default function ReportPage() {
  const { id = '', reportId = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<Reporting_TableFilterInput[]>(
    getFiltersFromSearchParams(searchParams)
  );
  const [interactiveValues, setInteractiveValues] = useState<{
    metric?: string;
    groupings?: string[];
    timeGrouping?: string;
  }>({});
  const { palette } = useTheme();

  const {
    data: reportData,
    isFetching,
    isLoading,
  } = useRunReports({
    topReportId: id,
    filter: {
      reportId,
      filters,
      ...interactiveValues,
    },
  });

  const mainColumns = useMemo<
    GridOptions<FormattedReportData[number]>['columnDefs']
  >(() => {
    const fieldsColumns = reportData?.fields || [];
    return fieldsColumns.map((column) => {
      // @ts-expect-error
      const valueGetter = ({ data }) => {
        if (!data) return null;

        const value = data[column.id] as GenericReportDataCell;
        return value?.value;
      };

      const mapped = {
        field: column.id,
        headerName: column.label,
        valueGetter,
        sortable: column.sortable,
        initialHide: !column.visibleByDefault,
        pinned: column.pinned ?? null,
        cellStyle: (params: any) => {
          if (!params?.data) return null;

          const colour = params?.data[column.id]?.colour;

          const backgroundColor =
            (palette?.[colour?.colour as keyof Palette] as Color)?.[
              colour?.shade as keyof Color
            ] ?? '';

          return {
            backgroundColor,
          };
        },
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
      if (column.minWidth) {
        // @ts-ignore
        mapped.minWidth = column.minWidth;
      }
      return mapped;
    });
  }, [reportData?.fields]);

  const mappedFilterValues = useMemo(
    () =>
      reportData?.filters?.map((filter) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const filterValue = filters.find(
          ({ filterId }) => filterId === filter.id
        )?.filterValue;

        return {
          ...filter,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          defaultValue: filterValue ?? filter.defaultValue,
        };
      }),
    [filters, reportData?.filters]
  );

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

  const updateValues = (newValues: {
    filters: Reporting_TableFilterInput[];
    metric?: string;
    groupings?: string[];
    timeGrouping?: string;
  }) => {
    const valuesForSearchParams = newValues.filters.reduce(
      (acc, { filterId, filterValue }) => {
        if (
          !filterValue ||
          (Array.isArray(filterValue) && filterValue.length === 0)
        ) {
          return acc;
        }

        acc[filterId] = Array.isArray(filterValue)
          ? filterValue.join(',')
          : String(filterValue);
        return acc;
      },
      {} as Record<string, string>
    );

    setSearchParams(valuesForSearchParams);
    setFilters(newValues.filters);
    setInteractiveValues({
      metric: newValues.metric,
      groupings: newValues.groupings,
      timeGrouping: newValues.timeGrouping,
    });
  };

  return (
    <>
      <DynamicForm
        isFetching={isFetching}
        filters={mappedFilterValues ?? []}
        onValueChange={updateValues}
        sql={reportData?.debug?.sql}
        isInteractiveReport={!!reportData?.info.isInteractive}
        preFilterFields={{
          stats: reportData?.metrics,
        }}
        groupingFields={{
          groupBy: reportData?.groupBy,
          timeGroupBy: reportData?.timeGroupBy,
        }}
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
