import { AgGridReact, AgGridReactProps } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-enterprise';
import { forwardRef, MutableRefObject, useState } from 'react';
import { Box, BoxProps, Card } from '@mui/material';

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
  tableContainerSx?: BoxProps['sx'];
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
    ...props
  }: TableProps<T>,
  ref: React.Ref<AgGridReact<T>>
) {
  const [searchValue, setSearchValue] = useState('');
  const ensuredForwardRef = useEnsuredForwardedRef(
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
    tableRef: ensuredForwardRef,
    onBulkSave,
  });

  return (
    <>
      <Card>
        <Box p={2}>
          <TableSearchInput
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Box>
        <Box
          className="ag-theme-tyro"
          sx={{ height: 500, ...tableContainerSx }}
        >
          <AgGridReact<(typeof props.rowData)[number]>
            ref={ensuredForwardRef}
            defaultColDef={defaultColDef}
            quickFilterText={searchValue}
            undoRedoCellEditing
            undoRedoCellEditingLimit={20}
            popupParent={document.body}
            suppressRowClickSelection
            enableRangeSelection
            enableFillHandle
            fillHandleDirection="y"
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
