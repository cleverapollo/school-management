import { Stack } from '@mui/material';
import { useCallback, useMemo } from 'react';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
  OnDragStartResponder,
} from 'react-beautiful-dnd';
import { SelectListDropArea } from './drop-area';

type SelectionListProps<T extends object | string> = {
  variant?: 'selection' | 'ordering';
  value: T[];
  options: T[];
  optionIdKey?: T extends object ? keyof T : never;
  optionTextKey?: T extends object ? keyof T : never;
  groupBy?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  isOptionEqualToValue?: (option: T, value: T) => boolean;
  getOptionLabel?: (option: T) => string;
  showSearch?: boolean;
  firstColumnLabel?: string;
  secondColumnLabel?: string;
};

const getListStyle = (isDraggingOver: boolean) =>
  ({
    backgroundColor: isDraggingOver ? 'indigo.200' : 'slate.200',
    borderColor: isDraggingOver ? 'indigo.100' : 'slate.100',
    borderRadius: 2,
    paddingY: 0.75,
    paddingX: 1.5,
  } as const);

export const SelectionList = <T extends object | string>({
  variant = 'selection',
  value,
  options,
  optionIdKey,
  optionTextKey,
  groupBy,
  isOptionEqualToValue,
  getOptionLabel: externalGetOptionLabel,
  showSearch,
  firstColumnLabel,
  secondColumnLabel,
}: SelectionListProps<T>) => {
  const { unselectedOptions, selectedOptions } = useMemo(() => {
    const doOptionsMatch = (option: T, valueOption: T) => {
      if (optionIdKey) {
        return option[optionIdKey] === valueOption[optionIdKey];
      }

      if (isOptionEqualToValue) {
        return isOptionEqualToValue(option, valueOption);
      }

      return option === value;
    };

    return {
      unselectedOptions: options.filter((option) =>
        value.every((valueOption) => !doOptionsMatch(option, valueOption))
      ),
      selectedOptions: options.filter((option) =>
        value.some((valueOption) => doOptionsMatch(option, valueOption))
      ),
    };
  }, [value, options, optionIdKey, isOptionEqualToValue]);

  const getOptionLabel = useCallback(
    (option: T) => {
      if (optionTextKey) {
        return option[optionTextKey] as unknown as string;
      }

      if (externalGetOptionLabel) {
        return externalGetOptionLabel(option);
      }

      if (
        process.env.NODE_ENV === 'development' &&
        typeof option === 'object'
      ) {
        console.warn(
          'You must provide either optionTextKey or getOptionLabel when using object as option type'
        );
      }

      return option as unknown as string;
    },
    [optionTextKey, externalGetOptionLabel]
  );

  const getOptionId = useCallback(
    (option: T) => {
      if (optionIdKey) {
        return option[optionIdKey] as unknown as string;
      }

      return JSON.stringify(option) as unknown as string;
    },
    [optionIdKey]
  );

  return (
    <DragDropContext onDragStart={() => {}} onDragEnd={() => {}}>
      <Stack direction="row" spacing={2}>
        <SelectListDropArea
          variant={variant}
          droppableId="unselected"
          label={firstColumnLabel ?? 'Unselected'}
          options={unselectedOptions}
          groupBy={groupBy}
          getOptionLabel={getOptionLabel}
          getOptionId={getOptionId}
          showSearch={showSearch}
        />
        <SelectListDropArea
          variant={variant}
          droppableId="selected"
          label={secondColumnLabel ?? 'Selected'}
          options={selectedOptions}
          groupBy={groupBy}
          getOptionLabel={getOptionLabel}
          getOptionId={getOptionId}
          showSearch={showSearch}
        />
      </Stack>
    </DragDropContext>
  );
};
