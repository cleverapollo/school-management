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
} from '@tanstack/react-table';
import { ColumnDef, createColumnHelper } from '@tanstack/table-core';
import { useState } from 'react';
import { ITableProps, TableColumn, TitleOverride } from "./types";
import { Table as MuiTable, TableContainer } from "@mui/material";
import TableHeader from "./TableHeader";
import TableToolbar from "./TableToolbar";
import TableBody from './TableBody';
import { calculateColumnsWithPermissions, createTitleForProfileTypes } from "../../utils/table";

const Table = <TData,>(props: ITableProps<TData>) => {
  const { data, title, titleOverride, columns } = props;

  //ToDo: use TypedSelector for profileType and permissions
  const profileType = 'Teacher';
  const permissions = ['ui:view:user'];

  const columnsWithPermission = calculateColumnsWithPermissions<TData>(columns, permissions, profileType);

  const tableTitle = createTitleForProfileTypes(profileType, titleOverride, title);

  const columnHelper = createColumnHelper<TData>();
  const calculateReactTableColumns = (columnsWithPermission: TableColumn<TData>[]): ColumnDef<TData, unknown>[] => 
    columnsWithPermission.map(column => columnHelper.accessor(column.fieldName, { header: column.columnDisplayName }));

  const table = useReactTable<TData>({
    enableFilters: false,
    enableColumnFilters: false,
    defaultColumn: {
      enableSorting: true,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      maxSize: undefined,
    },
    getCoreRowModel: getCoreRowModel(),
    data,
    columns: calculateReactTableColumns(columnsWithPermission) as ColumnDef<TData, any>[],
  });

  return(
    <TableContainer>
      <TableToolbar title={tableTitle} />
      <MuiTable>
        <TableHeader table={table} />
        <TableBody table={table} />
      </MuiTable>
    </TableContainer>
  );
} 

export default Table;
