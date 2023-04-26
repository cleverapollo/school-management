/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CellValueChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import set from 'lodash/set';
import { useCacheWithExpiry } from '../../../hooks/use-cache-with-expiry';

export enum EditState {
  Idle = 'IDLE',
  Saving = 'SAVING',
  Saved = 'SAVED',
  Error = 'ERROR',
}

export type BulkEditedRows = Record<
  string,
  {
    [key: string]: {
      originalValue: any;
      newValue: any;
    };
  }
>;

export interface UseEditableStateProps<T> {
  tableRef: MutableRefObject<AgGridReact<T>>;
  onBulkSave: ((data: BulkEditedRows) => Promise<unknown>) | undefined;
}

export function useEditableState<T extends object>({
  tableRef,
  onBulkSave,
}: UseEditableStateProps<T>) {
  const [editedRows, setEditedRows] = useCacheWithExpiry<BulkEditedRows>(
    'bulk-edit',
    {}
  );
  const [state, setState] = useState<EditState>(EditState.Idle);
  const numberOfEdits = useMemo(
    () =>
      Object.values(editedRows).reduce(
        (acc, row) => acc + Object.keys(row).length,
        0
      ),
    [editedRows]
  );

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent<T>) => {
      const { node, colDef } = params ?? {};

      setEditedRows((previousEditedRows) => {
        if (node.id && colDef.field) {
          const previousRowChanges = previousEditedRows[node.id] ?? {};

          if (!previousRowChanges[colDef.field]) {
            return {
              ...previousEditedRows,
              [node.id]: {
                ...previousRowChanges,
                [colDef.field]: {
                  originalValue: params?.oldValue ?? null,
                  newValue: params?.newValue ?? null,
                },
              },
            };
          }

          previousRowChanges[colDef.field].newValue = params?.newValue;

          if (
            previousRowChanges[colDef.field].originalValue ===
            (params?.newValue ?? null)
          ) {
            delete previousRowChanges[colDef.field];
          }

          if (Object.keys(previousRowChanges).length === 0) {
            delete previousEditedRows[node.id];
          }

          return {
            ...previousEditedRows,
          };
        }

        return previousEditedRows;
      });
    },
    [setEditedRows]
  );

  const applyUpdatesToTable = useCallback(
    (changeType: 'originalValue' | 'newValue') => {
      const rowsToUpdate = Object.entries(editedRows).reduce<T[]>(
        (acc, [id, changesForRow]) => {
          const rowWithCurrentValues =
            tableRef.current.api.getRowNode(id)?.data;

          if (!rowWithCurrentValues) {
            return acc;
          }

          Object.entries(changesForRow).forEach(([field, change]) => {
            set(rowWithCurrentValues, field, change[changeType]);
          });

          acc.push(rowWithCurrentValues);
          return acc;
        },
        []
      );

      tableRef.current.api.applyTransaction({
        update: rowsToUpdate,
      });
    },
    [editedRows, tableRef]
  );

  const onSave = async () => {
    if (onBulkSave) {
      try {
        setState(EditState.Saving);
        await onBulkSave(editedRows);
        setState(EditState.Saved);
        setEditedRows({});
      } catch (e) {
        setState(EditState.Error);
        console.error(e);
      } finally {
        setTimeout(() => {
          setState(EditState.Idle);
        }, 2000);
      }
    }
  };

  const onCancel = () => {
    applyUpdatesToTable('originalValue');
    setEditedRows({});
  };

  return {
    isEditing: numberOfEdits > 0 || state !== EditState.Idle,
    editingState: state,
    numberOfEdits,
    onSave,
    onCancel,
    onCellValueChanged,
    applyUpdatesToTable,
  };
}
