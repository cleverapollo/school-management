/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CellValueChangedEvent } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { MutableRefObject, useMemo, useState } from 'react';
import set from 'lodash/set';

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

export function useEditableState<T>({
  tableRef,
  onBulkSave,
}: UseEditableStateProps<T>) {
  const [editedRows, setEditedRows] = useState<BulkEditedRows>({});
  const [state, setState] = useState<EditState>(EditState.Idle);
  const numberOfEdits = useMemo(
    () =>
      Object.values(editedRows).reduce(
        (acc, row) => acc + Object.keys(row).length,
        0
      ),
    [editedRows]
  );

  const onCellValueChanged = (params: CellValueChangedEvent<T>) => {
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
                originalValue: params?.oldValue,
                newValue: params?.newValue || null,
              },
            },
          };
        }

        previousRowChanges[colDef.field].newValue = params?.newValue;

        if (
          previousRowChanges[colDef.field].originalValue === params?.newValue
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
  };

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
    const originalRows = Object.entries(editedRows).reduce<T[]>(
      (acc, [id, row]) => {
        const rowWithCurrentValues = tableRef.current.api.getRowNode(id)?.data;

        if (!rowWithCurrentValues) {
          return acc;
        }

        Object.entries(row).forEach(([field, { originalValue }]) => {
          set(rowWithCurrentValues, field, originalValue);
        });

        acc.push(rowWithCurrentValues);
        return acc;
      },
      []
    );

    tableRef.current.api.applyTransaction({
      update: originalRows,
    });
    setEditedRows({});
  };

  return {
    isEditing: numberOfEdits > 0 || state !== EditState.Idle,
    editingState: state,
    numberOfEdits,
    onSave,
    onCancel,
    onCellValueChanged,
  };
}
