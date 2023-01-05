import {
  useReactTable,
  TableOptions,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  getExpandedRowModel,
  SortingState,
  Row,
  getPaginationRowModel,
  Column,
  ColumnFiltersState,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  sortingFns,
  FilterFn,
  SortingFn,
  flexRender,
  FilterFns,
} from '@tanstack/react-table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { isEmpty } from 'lodash';
import { ITableProps, TableColumn } from "./types";
import { Table as MuiTable, TableContainer } from "@mui/material";
import TableHeader from "./TableHeader";
import TableFilters from "./TableFilters";
import TableBody from './TableBody';
import TablePagination from './TablePagination';
import { calculateColumnsWithPermissions, fuzzyFilter, fuzzySort } from "../../utils/table";
import { DEFAULT_PAGINATION_SIZE } from './constants';
import TableTabs from './TableTabs';

const Table = <TData,>(props: ITableProps<TData>) => {
  const { data, columns, tabs, onChangeTab, tabValue, onClickRow, isRowSelectionNeeded } = props;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([])

  //ToDo: use TypedSelector for profileType and permissions
  const profileType = 'Teacher';
  const permissions = ['ui:view:user'];

  const columnsWithPermission = calculateColumnsWithPermissions<TData>(columns, permissions, profileType);


  const columnHelper = createColumnHelper<TData>();
  const calculateReactTableColumns = (columnsWithPermission: TableColumn<TData>[]): ColumnDef<TData, unknown>[] =>
    columnsWithPermission.map(column => {
      const cell = column.component && { cell: column.component };
      return columnHelper.accessor(column.fieldName,
        {
          header: column.columnDisplayName,
          filterFn: 'fuzzy',
          sortingFn: fuzzySort,
          enableHiding: !column.isMandatory,
          enableSorting: !column.isSortNeeded,
          ...cell,
        })
    }
  );

  const table = useReactTable<TData>({
    data,
    columns: calculateReactTableColumns(columnsWithPermission) as ColumnDef<TData, any>[],
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    initialState: {
      pagination: {
        pageSize: DEFAULT_PAGINATION_SIZE,
      },
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return(<>
    <TableContainer sx={{
      boxShadow: '0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)',
      borderRadius: '16px' }}
    >
      <TableFilters table={table} columnsWithPermissions={columnsWithPermission} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      {!isEmpty(tabs) && <TableTabs tabs={tabs} onChangeTab={onChangeTab} tabValue={tabValue} />}
      <MuiTable>
        <TableHeader table={table} isRowSelectionNeeded={isRowSelectionNeeded}/>
        <TableBody table={table} onClickRow={onClickRow} isRowSelectionNeeded={isRowSelectionNeeded}/>
        <TablePagination table={table} />
      </MuiTable>
    </TableContainer>
  </>);
}

export default Table;
