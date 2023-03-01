import { AgGridReact, AgGridReactProps } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-enterprise';
import { forwardRef, MutableRefObject, useCallback, useState } from 'react';
import { Box, BoxProps, Card, CardProps, Stack } from '@mui/material';

import './styles.css';
import { ColDef, FirstDataRenderedEvent } from 'ag-grid-community';
import { useEnsuredForwardedRef } from 'react-use';
import { TableSearchInput } from './search-input';
import {
  useEditableState,
  UseEditableStateProps,
} from './hooks/use-editable-state';
import { BulkEditSaveBar } from './bulk-edit-save-bar';

export type { GridOptions, ICellRendererParams } from 'ag-grid-community';

export interface TableProps<T> extends AgGridReactProps<T> {
  rowData: T[];
  getRowId: AgGridReactProps<T>['getRowId'];
  onBulkSave?: UseEditableStateProps<T>['onBulkSave'];
  onRowSelection?: (selectedRows: T[]) => void;
  sx?: CardProps['sx'];
  tableContainerSx?: BoxProps['sx'];
  rightAdornment?: React.ReactNode;
}

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  cellStyle: {
    alignItems: 'center',
  },
  cellClass: (params) => {
    if (params.colDef.editable) {
      return 'ag-editable-cell';
    }
  },
};

function TableInner<T>(
  {
    onFirstDataRendered,
    onBulkSave,
    tableContainerSx,
    sx,
    onRowSelection,
    rightAdornment,
    ...props
  }: TableProps<T>,
  ref: React.Ref<AgGridReact<T>>
) {
  const [searchValue, setSearchValue] = useState('');
  const tableRef = useEnsuredForwardedRef(
    ref as MutableRefObject<AgGridReact<T>>
  );
  const {
    isEditing,
    editingState,
    numberOfEdits,
    onSave,
    onCancel,
    onCellValueChanged,
  } = useEditableState<T>({
    tableRef,
    onBulkSave,
  });

  const onSelectionChanged = useCallback(() => {
    const selectedRows = tableRef.current.api.getSelectedRows();
    if (onRowSelection) {
      onRowSelection(selectedRows);
    }
  }, []);

  return (
    <>
      <Card sx={sx}>
        <Stack direction="row" justifyContent="space-between" spacing={2} p={2}>
          <TableSearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {rightAdornment}
        </Stack>
        <Box
          className="ag-theme-tyro"
          sx={{ height: 500, ...tableContainerSx }}
        >
          <AgGridReact<(typeof props.rowData)[number]>
            ref={tableRef}
            defaultColDef={defaultColDef}
            quickFilterText={searchValue}
            undoRedoCellEditing
            undoRedoCellEditingLimit={20}
            popupParent={document.body}
            suppressRowClickSelection
            enableRangeSelection
            enableFillHandle
            fillHandleDirection="y"
            onSelectionChanged={onSelectionChanged}
            {...props}
            onCellValueChanged={onCellValueChanged}
            onFirstDataRendered={(params: FirstDataRenderedEvent<T>) => {
              params?.columnApi?.autoSizeAllColumns(false);

              if (onFirstDataRendered) {
                onFirstDataRendered(params);
              }
            }}
          />
        </Box>
      </Card>
      <BulkEditSaveBar
        isEditing={isEditing}
        editingState={editingState}
        numberOfEdits={numberOfEdits}
        onSave={onSave}
        onCancel={onCancel}
      />
    </>
  );
}

export const Table = forwardRef(TableInner) as <T>(
  props: TableProps<T> & { ref?: React.Ref<AgGridReact<T>> }
) => ReturnType<typeof TableInner>;
