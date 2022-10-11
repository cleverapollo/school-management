import { ITableProps } from "./types";
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

  const columnHeaders = columnsWithPermission.map(column => column.columnDisplayName);
  const cellComponents = columnsWithPermission.map(column => column.component);
  const rows = data.map(item => columnsWithPermission.map(column => column.valueIdentifier(item)));
  const tableTitle = createTitleForProfileTypes(profileType, titleOverride, title);

  return(
    <TableContainer>
      <TableToolbar title={tableTitle} />
      <MuiTable>
        <TableHeader columnHeaders={columnHeaders} />
        <TableBody rows={rows} components={cellComponents} />
      </MuiTable>
    </TableContainer>
  );
} 

export default Table;
