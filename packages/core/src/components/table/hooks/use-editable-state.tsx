/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CellValueChangedEvent,
  ValueSetterParams as AGValueSetterParams,
} from '@ag-grid-community/core';
import { AgGridReact } from '@ag-grid-community/react';
import { MutableRefObject, useCallback, useMemo, useState } from 'react';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { useCacheWithExpiry } from '../../../hooks/use-cache-with-expiry';
import { EditState } from '../../save-bar';

export interface ValueSetterParams<TData = any, CellValue = any>
  extends AGValueSetterParams<TData> {
  newValue: CellValue;
  oldValue: CellValue;
  isEditCheckCall?: boolean;
  isApplyUpdatesCall?: boolean;
}

type StringableKey<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? number
    : `${number}`
  : string | number;

type Path<T> = T extends object
  ? {
      [P in keyof T & StringableKey<T>]: `${P}` | `${P}.${Path<T[P]>}`;
    }[keyof T & StringableKey<T>]
  : never;

type PropType<T, Key extends string> = string extends Key
  ? unknown
  : Key extends keyof T
  ? T[Key]
  : Key extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PropType<NonNullable<T[K]>, R>
    : unknown
  : unknown;

export type BulkEditedRows<
  ObjectRow,
  Keys extends Path<NonNullable<ObjectRow>>
> = Record<
  string,
  {
    [Key in Keys]?: {
      originalValue: PropType<NonNullable<ObjectRow>, Key>;
      newValue: PropType<NonNullable<ObjectRow>, Key>;
    };
  }
>;

export interface UseEditableStateProps<T> {
  tableRef: MutableRefObject<AgGridReact<T> | undefined>;
  onBulkSave:
    | ((data: BulkEditedRows<T, Path<T>>) => Promise<unknown>)
    | undefined;
  onBulkSaveCanceled?: () => void;
}

type EditedRow<T> = Record<
  string,
  Record<
    string,
    {
      originalValue: CellValueChangedEvent<T>['oldValue'];
      newValue: CellValueChangedEvent<T>['newValue'];
    }
  >
>;

export function useEditableState<T>({
  tableRef,
  onBulkSave,
  onBulkSaveCanceled,
}: UseEditableStateProps<T>) {
  const [editedRows, setEditedRows] = useCacheWithExpiry<EditedRow<T>>(
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

      let newValue = params?.newValue;
      let oldValue = params?.oldValue;

      if (
        colDef?.valueSetter &&
        typeof colDef.valueSetter === 'function' &&
        colDef.field &&
        node.data
      ) {
        newValue = get(node.data, colDef.field);

        const dataForOldValue = cloneDeep(node.data);
        const valueSetterParams: ValueSetterParams<T> = {
          oldValue: params.newValue,
          newValue: params.oldValue,
          colDef,
          column: params.column,
          node,
          data: dataForOldValue,
          api: params.api,
          columnApi: params.columnApi,
          context: params.context,
          isEditCheckCall: true,
        };
        colDef.valueSetter(valueSetterParams);

        oldValue = get(dataForOldValue, colDef.field);
      }

      setEditedRows((previousEditedRows) => {
        if (node.id && colDef.field) {
          const previousRowChanges = previousEditedRows[node.id] ?? {};

          if (!previousRowChanges[colDef.field]) {
            // Don't update if the value hasn't changed. Needed for objects passed by reference
            if (isEqual(oldValue, newValue)) {
              return previousEditedRows;
            }

            return {
              ...previousEditedRows,
              [node.id]: {
                ...previousRowChanges,
                [colDef.field]: {
                  originalValue: oldValue ?? null,
                  newValue: newValue ?? null,
                },
              },
            };
          }

          previousRowChanges[colDef.field].newValue = newValue;

          if (
            isEqual(
              previousRowChanges[colDef.field].originalValue,
              newValue ?? null
            )
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
      const currentTableRef = tableRef?.current;
      if (!currentTableRef) return;

      const rowsToUpdate = Object.entries(editedRows).reduce<T[]>(
        (acc, [id, changesForRow]) => {
          const rowNode = currentTableRef.api.getRowNode(id);
          const rowWithCurrentValues = rowNode?.data;

          if (!rowNode || !rowWithCurrentValues) {
            return acc;
          }

          Object.entries(changesForRow).forEach(([field, change]) => {
            const column = currentTableRef.columnApi.getColumn(field);
            const colDef = column?.getColDef();

            if (
              column &&
              colDef?.valueSetter &&
              typeof colDef.valueSetter === 'function'
            ) {
              const valueSetterParams: ValueSetterParams<T> = {
                oldValue:
                  change[
                    changeType === 'originalValue'
                      ? 'newValue'
                      : 'originalValue'
                  ],
                newValue: change[changeType],
                colDef,
                column,
                node: rowNode,
                data: rowWithCurrentValues,
                api: currentTableRef.api,
                columnApi: currentTableRef.columnApi,
                context: currentTableRef.context,
                isApplyUpdatesCall: true,
              };
              colDef.valueSetter(valueSetterParams);
            } else {
              set(rowWithCurrentValues, field, change[changeType]);
            }
          });

          acc.push(rowWithCurrentValues);
          return acc;
        },
        []
      );

      currentTableRef.api.applyTransaction({
        update: rowsToUpdate,
      });
      currentTableRef.api.refreshCells({
        force: true,
      });
    },
    [editedRows, tableRef]
  );

  const onSave = async () => {
    if (onBulkSave) {
      try {
        setState(EditState.Saving);
        await onBulkSave(editedRows as BulkEditedRows<T, Path<T>>);
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
    onBulkSaveCanceled?.();
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

export type ReturnTypeUseEditableState<T> = ReturnType<
  typeof useEditableState<T>
>;
