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
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils';
import { ColumnDef, createColumnHelper } from '@tanstack/table-core';
import { useState } from 'react';
import { ITableProps, TableColumn, TitleOverride } from "./types";
import { Table as MuiTable, TableContainer } from "@mui/material";
import TableHeader from "./TableHeader";
import TableToolbar from "./TableToolbar";
import TableBody from './TableBody';
import { calculateColumnsWithPermissions, createTitleForProfileTypes } from "../../utils/table";

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
}

const Table = <TData,>(props: ITableProps<TData>) => {
  const { data, title, titleOverride, columns } = props;

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');

  //ToDo: use TypedSelector for profileType and permissions
  const profileType = 'Teacher';
  const permissions = ['ui:view:user'];

  const columnsWithPermission = calculateColumnsWithPermissions<TData>(columns, permissions, profileType);

  const tableTitle = createTitleForProfileTypes(profileType, titleOverride, title);

  const columnHelper = createColumnHelper<TData>();
  const calculateReactTableColumns = (columnsWithPermission: TableColumn<TData>[]): ColumnDef<TData, unknown>[] => 
    columnsWithPermission.map(column => columnHelper.accessor(column.fieldName, 
      { 
        header: column.columnDisplayName,
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
      }));

  const table = useReactTable<TData>({
    data,
    columns: calculateReactTableColumns(columnsWithPermission) as ColumnDef<TData, any>[],
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
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
    <TableContainer>
      <TableToolbar table={table} title={tableTitle} columnsWithPermissions={columnsWithPermission} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <MuiTable>
        <TableHeader table={table} />
        <TableBody table={table} />
      </MuiTable>
    </TableContainer>
  </>);
} 

export default Table;
