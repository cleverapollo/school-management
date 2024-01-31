import { ICellRendererParams, Table, TableProps } from '@tyro/core';
import { Reporting_TableFilterInput } from '@tyro/api';
import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Color, Palette, useTheme } from '@mui/material';

import { useRunReports } from '../api/run-report';
import { DynamicForm } from '../components/dynamic-form';
import {
  ExtendedReportData,
  ExtendedTableReportField,
  ReportCellType,
  ReportColumnDef,
} from '../components/types';
import { useFormatTableValues } from '../hooks/use-format-values';
import { mockTableReport } from './mock-custom-values';

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
  const { valueGetters, cellRenders } = useFormatTableValues();

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
    const fields = (reportData?.fields || []) as ExtendedTableReportField[];

    // NOTE: only for testing purposes
    // const mockFields = mockTableReport.fields;

    return fields.map<ReportColumnDef>((column) => ({
      field: column.id,
      headerName: column.label,
      valueGetter: ({ data }) => {
        if (!data) return null;
        const value = data[column.id];

        switch (column.cellType) {
          case ReportCellType.Person: {
            return valueGetters.getPersonValue(value);
          }
          case ReportCellType.PartyGroup: {
            return valueGetters.getPartyGroupValue(value);
          }
          case ReportCellType.Date: {
            return valueGetters.getDateValue(value, column);
          }
          case ReportCellType.Currency: {
            return valueGetters.getCurrencyValue(value, column);
          }
          case ReportCellType.Boolean: {
            return valueGetters.getBooleanValue(value);
          }
          case ReportCellType.PhoneNumber: {
            return valueGetters.getPhoneNumberValue(value);
          }
          case ReportCellType.Chip: {
            return valueGetters.getChipValue(value);
          }
          case ReportCellType.Raw:
          default: {
            return valueGetters.getRawValue(value);
          }
        }
      },
      // eslint-disable-next-line react/no-unstable-nested-components
      cellRenderer: ({ data }: ICellRendererParams<ExtendedReportData>) => {
        if (!data) return null;
        const value = data[column.id];

        switch (column.cellType) {
          case ReportCellType.Person: {
            return cellRenders.renderPersonAvatar(value, column);
          }
          case ReportCellType.PartyGroup: {
            return cellRenders.renderPartyGroupAvatar(value, column);
          }
          case ReportCellType.Date: {
            return valueGetters.getDateValue(value, column);
          }
          case ReportCellType.Currency: {
            return valueGetters.getCurrencyValue(value, column);
          }
          case ReportCellType.Boolean: {
            return cellRenders.renderBooleanValue(value);
          }
          case ReportCellType.PhoneNumber: {
            return valueGetters.getPhoneNumberValue(value);
          }
          case ReportCellType.Chip: {
            return cellRenders.renderChipValue(value, column);
          }
          case ReportCellType.Raw:
          default: {
            return valueGetters.getRawValue(value);
          }
        }
      },
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

    // NOTE: only for testing purposes
    // const mockData = mockTableReport.data;

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
