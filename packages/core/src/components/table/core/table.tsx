import {
  useMemo,
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useCallback,
  useState,
} from 'react';
import { LicenseManager } from 'ag-grid-enterprise';
import { AgGridReact, AgGridReactProps } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import { Box, BoxProps, Card, CardProps, Stack } from '@mui/material';

import './styles.css';
import {
  ColDef,
  ColumnRowGroupChangedEvent,
  FirstDataRenderedEvent,
} from 'ag-grid-community';
import { useEnsuredForwardedRef, useMeasure } from 'react-use';
import {
  useEditableState,
  UseEditableStateProps,
} from '../hooks/use-editable-state';
import { BulkEditSaveBar } from './bulk-edit-save-bar';
import { SearchInput } from '../../search-input';

export type {
  GridOptions,
  ICellRendererParams,
  ValueSetterParams,
  CellValueChangedEvent,
  ICellEditorParams,
  ValueGetterParams,
} from 'ag-grid-community';

export type { AgGridReact } from 'ag-grid-react';

if (process.env.AG_GRID_KEY) {
  LicenseManager.setLicenseKey(process.env.AG_GRID_KEY);
}

export interface TableProps<T> extends AgGridReactProps<T> {
  rowData: T[];
  getRowId: AgGridReactProps<T>['getRowId'];
  onBulkSave?: UseEditableStateProps<T>['onBulkSave'];
  onRowSelection?: (selectedRows: T[]) => void;
  sx?: CardProps['sx'];
  tableContainerSx?: BoxProps['sx'];
  rightAdornment?: React.ReactNode;
  toolbar?: React.ReactNode;
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

const TOOLBAR_HEIGHT = 72;
const MIN_TABLE_HEIGHT = 320;

function TableInner<T extends object>(
  {
    onFirstDataRendered,
    onBulkSave,
    tableContainerSx,
    sx,
    onRowSelection,
    rightAdornment,
    autoGroupColumnDef,
    rowHeight = 56,
    rowSelection,
    onColumnEverythingChanged,
    toolbar,
    ...props
  }: TableProps<T>,
  ref: React.Ref<AgGridReact<T>>
) {
  const [searchValue, setSearchValue] = useState('');
  const tableRef = useEnsuredForwardedRef(
    ref as MutableRefObject<AgGridReact<T>>
  );
  const [tableContainerRef, { height: tableContainerHeight }] = useMeasure();

  const spaceForTable = tableContainerHeight;
  const heightBasedOnRows = (props.rowData.length + 1) * rowHeight;
  const innerContainerHeight = Math.max(
    Math.min(heightBasedOnRows, spaceForTable),
    MIN_TABLE_HEIGHT
  );

  const {
    isEditing,
    editingState,
    numberOfEdits,
    onSave,
    onCancel,
    onCellValueChanged,
    applyUpdatesToTable,
  } = useEditableState<T>({
    tableRef,
    onBulkSave,
  });

  const colDefs = useMemo(
    () => ({
      ...defaultColDef,
      ...props.defaultColDef,
    }),
    [props.defaultColDef]
  );

  const onSelectionChanged = useCallback(() => {
    const selectedRows = tableRef.current.api.getSelectedRows();
    if (onRowSelection) {
      onRowSelection(selectedRows);
    }
  }, []);

  const defaultAutoGroupColumnDef =
    rowSelection === 'multiple'
      ? {
          cellRendererParams: {
            checkbox: true,
          },
        }
      : undefined;

  const onColumnRowGroupChanged = useCallback(
    ({ column, columnApi }: ColumnRowGroupChangedEvent) => {
      if (column) {
        const colDef = column.getColDef();
        const sort = column.getSort();
        const colId = column.getColId();

        if (colDef.sortable && sort === undefined) {
          columnApi.applyColumnState({
            state: [{ colId, sort: 'asc' }],
            defaultState: { sort: null },
          });
        }
      }
    },
    []
  );

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          maxHeight:
            Math.max(MIN_TABLE_HEIGHT, heightBasedOnRows) + TOOLBAR_HEIGHT,
          ...sx,
        }}
      >
        {toolbar || (
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            p={2}
          >
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {rightAdornment}
          </Stack>
        )}
        <Box
          ref={tableContainerRef}
          className="ag-theme-tyro"
          sx={{
            ...tableContainerSx,
          }}
        >
          <Box
            sx={{
              height: innerContainerHeight,
            }}
          >
            <AgGridReact<(typeof props.rowData)[number]>
              ref={tableRef}
              quickFilterText={searchValue}
              undoRedoCellEditing
              undoRedoCellEditingLimit={20}
              popupParent={document.body}
              suppressRowClickSelection
              enableRangeSelection
              enableFillHandle
              fillHandleDirection="y"
              allowContextMenuWithControlKey
              onSelectionChanged={onSelectionChanged}
              rowHeight={rowHeight}
              rowSelection={rowSelection}
              autoGroupColumnDef={
                autoGroupColumnDef || defaultAutoGroupColumnDef
              }
              groupSelectsChildren={rowSelection === 'multiple'}
              groupSelectsFiltered={rowSelection === 'multiple'}
              stopEditingWhenCellsLoseFocus
              {...props}
              defaultColDef={colDefs}
              onCellValueChanged={(args) => {
                onCellValueChanged(args);
                props.onCellValueChanged?.(args);
              }}
              onFirstDataRendered={(params: FirstDataRenderedEvent<T>) => {
                params?.columnApi?.autoSizeAllColumns(false);
                applyUpdatesToTable('newValue');

                if (onFirstDataRendered) {
                  onFirstDataRendered(params);
                }
              }}
              onColumnEverythingChanged={(params) => {
                applyUpdatesToTable('newValue');

                if (onColumnEverythingChanged) {
                  onColumnEverythingChanged(params);
                }
              }}
              onColumnRowGroupChanged={onColumnRowGroupChanged}
            />
          </Box>
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
  props: TableProps<T> & { ref?: ForwardedRef<AgGridReact<T>> | null }
) => ReturnType<typeof TableInner>;
