import { TablePagination as MuiTablePagination } from '@mui/material';
import { Table } from '@tanstack/react-table';
import { PAGINATION_ROWS_PER_PAGE_OPTIONS } from './constants';

interface ITablePaginationProps<TData> {
  table: Table<TData>;
}

const TablePagination = <TData,>({ table }: ITablePaginationProps<TData>) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    table.setPageIndex(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setPageSize(Number(event.target.value));
    table.setPageIndex(0);
  };

  return (
  <MuiTablePagination 
    page={table.getState().pagination.pageIndex}
    count={table.getPrePaginationRowModel().rows.length}
    rowsPerPageOptions={PAGINATION_ROWS_PER_PAGE_OPTIONS}
    rowsPerPage={table.getState().pagination.pageSize}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />);
}

export default TablePagination;
