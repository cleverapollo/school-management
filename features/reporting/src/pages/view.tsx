import {
  GridOptions,
  Table,
  DisplayedColumnsChangedEvent,
  ColumnApi,
  Column,
} from '@tyro/core';
import {
  Reporting_TableFilter,
  Reporting_TableFilterInput,
  Reporting_TableFilterType,
} from '@tyro/api';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Color, Palette, useTheme } from '@mui/material';
import { useRunReports } from '../api/run-report';
import { DynamicForm } from '../components/dynamic-form';

type GenericReportData = Array<{ [key: string]: GenericReportDataCell }>;
type GenericReportDataCell = { value: any; colour: string };
type FormattedReportData = Array<{ [key: string]: GenericReportDataCell }>;

const parseURLFilterValue = (
  formValue: string,
  inputType?: Reporting_TableFilterType
) => {
  switch (inputType) {
    case Reporting_TableFilterType.Checkbox:
      return formValue === 'true';
    case Reporting_TableFilterType.MultiSelect: {
      return formValue
        ? formValue
            .split(',')
            .map((value: string) =>
              Number.isNaN(Number(value)) ? String(value) : Number(value)
            )
        : [];
    }
    case Reporting_TableFilterType.InputNumber:
      return Number.isNaN(Number(formValue))
        ? String(formValue)
        : Number(formValue);
    case Reporting_TableFilterType.Select:
      return Number(formValue);
    case Reporting_TableFilterType.Input:
    default:
      return String(formValue);
  }
};

export const getURLFromFilters = (filters: Reporting_TableFilter[]) =>
  filters
    .filter(({ defaultValue }) =>
      Array.isArray(defaultValue)
        ? !!defaultValue.length
        : defaultValue !== undefined
    )
    .map(({ id: idx, defaultValue }) =>
      Array.isArray(defaultValue)
        ? `${idx}=${defaultValue.join(',')}`
        : `${idx}=${String(defaultValue)}`
    )
    .join('&');

export default function ReportPage() {
  const { id = '', reportId = '' } = useParams();
  const [filters, setFilters] = useState<Reporting_TableFilter[]>([]);
  const [showFields, setShowFields] = useState<string[] | null>(null);
  const { palette } = useTheme();
  const params = new URL(window.location.href).searchParams;

  const navigate = useNavigate();

  const filterPayload = useMemo(
    () =>
      filters
        ?.filter((filter) => filter?.defaultValue !== undefined)
        .map<Reporting_TableFilterInput>((filter) => ({
          filterId: filter.id,
          filterValue: filter?.defaultValue,
        })),
    [filters]
  );

  const {
    data: reportData,
    isFetching,
    isLoading,
  } = useRunReports({
    topReportId: id,
    filter: {
      reportId,
      filters: filterPayload,
      showFields,
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
        cellStyle: (params: any) => {
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

  const onDisplayedColumnsChanged = (
    event: DisplayedColumnsChangedEvent<unknown>
  ) => {
    const columnApi: ColumnApi = event?.columnApi;
    const displayColumns: Column[] = columnApi?.getAllDisplayedColumns() ?? [];

    setShowFields(displayColumns?.map((column) => column.getColId()));
  };

  useEffect(() => {
    if (!!reportData?.filters?.length && !filters.length && !params.size) {
      setFilters(reportData?.filters);
    }
  }, [reportData?.filters, filters, params]);

  useEffect(() => {
    if (params.size && !filters.length) {
      const updatedFilter = (reportData?.filters ?? []).map((filter) => {
        const filterValueFromURL = parseURLFilterValue(
          params.get(filter.id) ?? '',
          filter.inputType
        );
        const shouldUpdate =
          JSON.stringify(filter.defaultValue) !==
          JSON.stringify(filterValueFromURL);

        return {
          ...filter,
          defaultValue: shouldUpdate
            ? filterValueFromURL
            : filter?.defaultValue,
        };
      });

      if (JSON.stringify(updatedFilter) !== JSON.stringify(filters)) {
        setFilters(updatedFilter);
      }
    }
  }, [params, reportData?.filters]);

  useEffect(() => {
    if (filters.length) {
      const redirectUrl = getURLFromFilters(filters);

      navigate(`?${redirectUrl}`);
    }
  }, [filters]);

  return (
    <>
      <DynamicForm
        isFetching={isFetching}
        filters={filters}
        onFilterChange={setFilters}
        sql={reportData?.debug?.sql ?? ''}
      />
      <Table<FormattedReportData[number]>
        isLoading={isLoading}
        rowData={genericReportData}
        columnDefs={mainColumns}
        gridOptions={{
          ...reportData?.tableDisplayOptions?.gridOptions,
          onDisplayedColumnsChanged,
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
