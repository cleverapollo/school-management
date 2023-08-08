import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { ICellEditorParams } from 'ag-grid-community';
import { ClickAwayListener, MenuItem, MenuList } from '@mui/material';

export interface TableSelectProps<TSelectOption>
  extends ICellEditorParams<unknown, string | number> {
  options: TSelectOption[];
  getOptionLabel?: (option: TSelectOption) => string;
  renderOption?: (option: TSelectOption) => React.ReactNode;
  optionIdKey?: TSelectOption extends string | number
    ? never
    : keyof TSelectOption;
}

function checkTableSelectorProps<TSelectOption>(
  props: TableSelectProps<TSelectOption>
): asserts props is TableSelectProps<TSelectOption> {
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(props.options)) {
      throw new Error(
        `Please provide an array of options to cellEditorSelector.params.options for the TableSelect component in the ${
          props?.colDef?.headerName ?? ''
        } column`
      );
    }

    if (
      typeof props.getOptionLabel !== 'function' &&
      typeof props.renderOption !== 'function'
    ) {
      throw new Error(
        `Please provide a getOptionLabel or renderOption function to cellEditorSelector.params.getOptionLabel/renderOption for the TableSelect component in the ${
          props?.colDef?.headerName ?? ''
        } column`
      );
    }

    if (!props.optionIdKey) {
      throw new Error(
        `Please provide a optionIdKey to cellEditorSelector.params.optionIdKey for the TableSelect component in the ${
          props?.colDef?.headerName ?? ''
        } column`
      );
    }
  }
}

function TableSelectInner<TSelectOption>(
  props: TableSelectProps<TSelectOption>,
  ref: ForwardedRef<unknown>
) {
  const {
    value: originalValue,
    stopEditing,
    options = [],
    optionIdKey,
    getOptionLabel,
    renderOption,
  } = props;
  const selectedValue = useRef(originalValue);

  useImperativeHandle(ref, () => ({
    getValue() {
      return selectedValue.current;
    },
  }));

  checkTableSelectorProps(props);

  return (
    <ClickAwayListener onClickAway={() => stopEditing(false)}>
      <MenuList autoFocus={!originalValue}>
        {options?.map((option) => {
          const value = optionIdKey
            ? (option[optionIdKey] as string)
            : String(option);

          return (
            <MenuItem
              key={value}
              value={value}
              selected={value === originalValue}
              autoFocus={value === originalValue}
              onFocus={() => {
                selectedValue.current = value;
              }}
              onClick={() => {
                selectedValue.current = value;
                stopEditing(false);
              }}
            >
              {renderOption && renderOption(option)}
              {getOptionLabel && getOptionLabel(option)}
            </MenuItem>
          );
        })}
      </MenuList>
    </ClickAwayListener>
  );
}

export const TableSelect = forwardRef(TableSelectInner) as <TSelectOption>(
  props: TableSelectProps<TSelectOption> & {
    ref?: React.ForwardedRef<unknown>;
  }
) => ReturnType<typeof TableSelectInner>;
