import {
  useMemo,
  ForwardedRef,
  forwardRef,
  useCallback,
  useState,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  ModuleRegistry,
  ColDef,
  ColumnRowGroupChangedEvent,
} from '@ag-grid-community/core';

import { LicenseManager } from '@ag-grid-enterprise/core';

import { AgGridReact, AgGridReactProps } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { CsvExportModule } from '@ag-grid-community/csv-export';

import { ClipboardModule } from '@ag-grid-enterprise/clipboard';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';

import '@ag-grid-community/styles/ag-grid.css';
import { Box, BoxProps, Card, CardProps, Stack } from '@mui/material';

import './styles.css';
import { useMeasure } from 'react-use';
import { useMergeRefs } from '../../../hooks/use-merge-refs';
import {
  ReturnTypeUseEditableState,
  useEditableState,
  UseEditableStateProps,
} from '../hooks/use-editable-state';
import { BulkEditSaveBar } from './bulk-edit-save-bar';
import { SearchInput } from '../../search-input';
import { TableLoadingOverlay } from './loading-overlay';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  ClipboardModule,
  ExcelExportModule,
  RangeSelectionModule,
  MenuModule,
  RowGroupingModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
  StatusBarModule,
]);

export type {
  GridOptions,
  ICellRendererParams,
  CellValueChangedEvent,
  ICellEditorParams,
  ValueGetterParams,
  ValueFormatterParams,
  NewValueParams,
  ProcessCellForExportParams,
} from '@ag-grid-community/core';
export type {
  ReturnTypeUseEditableState as ReturnTypeTableUseEditableState,
  ValueSetterParams,
} from '../hooks/use-editable-state';

export type { AgGridReact } from '@ag-grid-community/react';

if (process.env.AG_GRID_KEY) {
  LicenseManager.setLicenseKey(process.env.AG_GRID_KEY);
}

export interface TableProps<T> extends AgGridReactProps<T> {
  rowData: T[];
  getRowId: AgGridReactProps<T>['getRowId'];
  onBulkSave?: UseEditableStateProps<T>['onBulkSave'];
  onBulkSaveCanceled?: UseEditableStateProps<T>['onBulkSaveCanceled'];
  onRowSelection?: (selectedRows: T[]) => void;
  sx?: CardProps['sx'];
  tableContainerSx?: BoxProps['sx'];
  rightAdornment?: React.ReactNode;
  toolbar?: React.ReactNode;
  editingStateRef?: React.Ref<ReturnTypeUseEditableState<T>>;
  isLoading?: boolean;
  additionalEditBarElements?: React.ReactNode;
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

const quickFilterMatcher = (
  quickFilterParts: string[],
  rowQuickFilterAggregateText: string
) => {
  const normalisedRow = rowQuickFilterAggregateText
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
  return quickFilterParts.every((part) => normalisedRow.match(part));
};

const TOOLBAR_HEIGHT = 72;
const MIN_TABLE_HEIGHT = 460;

function TableInner<T extends object>(
  {
    onFirstDataRendered,
    onBulkSave,
    onBulkSaveCanceled,
    tableContainerSx,
    sx,
    onRowSelection,
    rightAdornment,
    autoGroupColumnDef,
    rowHeight = 56,
    rowSelection,
    onColumnEverythingChanged,
    toolbar,
    editingStateRef,
    isLoading,
    additionalEditBarElements,
    ...props
  }: TableProps<T>,
  ref: React.Ref<AgGridReact<T>>
) {
  const [searchValue, setSearchValue] = useState('');
  const tableRef = useRef<AgGridReact<T>>();
  const refs = useMergeRefs(tableRef, ref);
  const [tableContainerRef, { height: tableContainerHeight }] = useMeasure();

  const heightBasedOnRows = (props.rowData.length + 1) * rowHeight;

  const innerContainerHeight = Math.max(
    Math.min(heightBasedOnRows, tableContainerHeight),
    MIN_TABLE_HEIGHT
  );

  const [tableHeight, setTableHeight] = useState(innerContainerHeight);

  const editingUtils = useEditableState<T>({
    tableRef,
    onBulkSave,
    onBulkSaveCanceled,
  });
  const {
    isEditing,
    editingState,
    numberOfEdits,
    onSave,
    onCancel,
    onCellValueChanged,
    applyUpdatesToTable,
  } = editingUtils;

  useImperativeHandle(editingStateRef, () => editingUtils, [editingUtils]);

  const colDefs = useMemo<ColDef<T>>(
    () => ({
      ...(defaultColDef as ColDef<T>),
      ...props.defaultColDef,
    }),
    [props.defaultColDef]
  );

  const onSelectionChanged = useCallback(() => {
    const selectedRows = tableRef?.current?.api?.getSelectedRows();
    if (onRowSelection && selectedRows) {
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

  const calculateTableHeight = useCallback(() => {
    const hasAutoHeight = (props.columnDefs || []).some(
      (columnDef: ColDef<T>) => columnDef.autoHeight
    );

    if (hasAutoHeight) {
      const nodes = tableRef.current?.api.getRenderedNodes() || [];
      const rowIds = nodes.flatMap((row) => (row.id ? [row.id] : []));

      const currentTableHeight = rowIds.reduce((height, rowId) => {
        const currentRow = document.querySelector(`[row-id="${rowId}"]`);
        const { clientHeight = 0 } = currentRow || {};

        return height + clientHeight;
      }, TOOLBAR_HEIGHT);

      setTableHeight(currentTableHeight);
    }
  }, [props.columnDefs]);

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: MIN_TABLE_HEIGHT,
          maxHeight:
            Math.max(MIN_TABLE_HEIGHT, heightBasedOnRows, tableHeight) +
            TOOLBAR_HEIGHT,
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
              height: Math.max(innerContainerHeight, tableHeight),
              flex: 1,
            }}
          >
            {isLoading ? (
              <TableLoadingOverlay />
            ) : (
              <AgGridReact<(typeof props.rowData)[number]>
                ref={refs}
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
                quickFilterMatcher={quickFilterMatcher}
                defaultColDef={colDefs}
                onCellValueChanged={(args) => {
                  onCellValueChanged(args);
                  props.onCellValueChanged?.(args);
                }}
                onFirstDataRendered={(params) => {
                  const { columnApi } = params;
                  columnApi.autoSizeAllColumns(false);
                  const columnWidths = props.columnDefs
                    ?.filter(
                      (column: ColDef<T>) =>
                        column?.width && (column?.field || column?.colId)
                    )
                    ?.map((column: ColDef<T>) => ({
                      key: (column.field || column.colId) as string,
                      newWidth: column.width as number,
                    }));

                  if (columnWidths) {
                    columnApi.setColumnWidths(columnWidths);
                  }

                  applyUpdatesToTable('newValue');

                  onFirstDataRendered?.(params);
                  calculateTableHeight();
                }}
                onModelUpdated={(params) => {
                  props.onModelUpdated?.(params);
                  calculateTableHeight();
                }}
                onColumnEverythingChanged={(params) => {
                  applyUpdatesToTable('newValue');
                  onColumnEverythingChanged?.(params);
                }}
                onColumnRowGroupChanged={onColumnRowGroupChanged}
              />
            )}
          </Box>
        </Box>
      </Card>
      <BulkEditSaveBar
        isEditing={isEditing}
        editingState={editingState}
        numberOfEdits={numberOfEdits}
        onSave={onSave}
        onCancel={onCancel}
        additionalEditBarElements={additionalEditBarElements}
      />
    </>
  );
}

export const Table = forwardRef(TableInner) as <T>(
  props: TableProps<T> & { ref?: ForwardedRef<AgGridReact<T>> | null }
) => ReturnType<typeof TableInner>;
