import { ICellRendererParams, Table, TableProps } from '@tyro/core';
import { Reporting_TableFilterInput } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Color, Palette, useTheme } from '@mui/material';

import { useRunReports } from '../api/run-report';
import { DynamicForm } from '../components/dynamic-form';
import { ExtendedReportData, ReportColumnDef } from '../components/types';
import { useReportFormatValues } from '../hooks/use-report-format-values';

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
  const { getValue, renderValue } = useReportFormatValues();

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

  const mainColumns = useMemo<ReportColumnDef[]>(() => {
    const fields = reportData?.fields || [];

    return fields.map<ReportColumnDef>((column) => ({
      field: column.id,
      headerName: column.label,
      valueGetter: ({ data }) => {
        if (!data) return null;

        return getValue(column, data[column.id]);
      },
      cellRenderer: ({ data }: ICellRendererParams<ExtendedReportData>) => {
        if (!data) return null;

        return renderValue(column, data[column.id]) || '-';
      },
      filterValueGetter: ({ data }) => getValue(column, data?.[column.id]),
      sortable: column.sortable,
      initialHide: !column.visibleByDefault,
      pinned: column.pinned ?? null,
      wrapText: true,
      autoHeight: true,
      ...(column.minWidth && {
        minWidth: column.minWidth,
      }),
      ...(column.maxWidth && {
        maxWidth: column.maxWidth,
      }),
      cellStyle: (params) => {
        if (!params?.data) return null;

        const colour = params?.data[column.id]?.colour;

        const baseColorKey = colour?.colour as keyof Palette;
        const shadeColorKey = colour?.shade as keyof Color;
        const baseColor = palette?.[baseColorKey] as Color;

        return {
          backgroundColor: baseColor?.[shadeColorKey] ?? '',
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
    }));
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

  const genericReportData = useMemo<ExtendedReportData[]>(() => {
    const reportFieldsData = (reportData?.data || []) as ExtendedReportData[];

    return reportFieldsData.reduce<ExtendedReportData[]>(
      (reportFieldData, obj) => {
        const rowData = Object.keys(obj).reduce((row, key) => {
          row[key] ??= obj[key];
          return row;
        }, {} as ExtendedReportData);

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
      <Table<ExtendedReportData>
        isLoading={isLoading}
        rowData={genericReportData}
        columnDefs={mainColumns}
        gridOptions={
          reportData?.tableDisplayOptions
            ?.gridOptions as TableProps<ExtendedReportData>['gridOptions']
        }
        tableContainerSx={
          reportData?.tableDisplayOptions
            ?.tableContainerSx as TableProps<ExtendedReportData>['tableContainerSx']
        }
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
