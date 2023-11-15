import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { ICellEditorParams } from '@ag-grid-community/core';
import {
  ClickAwayListener,
  Divider,
  MenuItem,
  MenuList,
  Tooltip,
  TooltipProps as MuiTooltipProps,
} from '@mui/material';

interface OptionProps {
  disabled?: boolean;
  disabledTooltip?: string;
  TooltipProps?: MuiTooltipProps;
  [key: string]: unknown;
}

export interface TableSelectProps<TSelectOption extends OptionProps>
  extends ICellEditorParams<unknown, string | number> {
  options: TSelectOption[] | TSelectOption[][];
  getOptionLabel?: (option: TSelectOption) => string;
  renderOption?: (option: TSelectOption) => React.ReactNode;
  optionIdKey?: TSelectOption extends string | number
    ? never
    : keyof TSelectOption;
}

function checkTableSelectorProps<TSelectOption extends OptionProps>(
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

function TableSelectInner<TSelectOption extends OptionProps>(
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

  const getOption = useCallback(
    (option: TSelectOption) => {
      const value = optionIdKey
        ? (option[optionIdKey] as string)
        : String(option);
      const { disabled, disabledTooltip, TooltipProps } = option;

      const menuItem = (
        <MenuItem
          key={value}
          value={value}
          selected={value === originalValue}
          autoFocus={value === originalValue}
          onFocus={() => {
            selectedValue.current = value;
          }}
          disabled={disabled}
          onClick={() => {
            selectedValue.current = value;
            stopEditing(false);
          }}
        >
          {renderOption && renderOption(option)}
          {getOptionLabel && getOptionLabel(option)}
        </MenuItem>
      );

      return disabled && disabledTooltip ? (
        <Tooltip title={disabledTooltip} {...TooltipProps}>
          <span>{menuItem}</span>
        </Tooltip>
      ) : (
        menuItem
      );
    },
    [originalValue, stopEditing, optionIdKey, getOptionLabel, renderOption]
  );

  checkTableSelectorProps(props);

  return (
    <ClickAwayListener onClickAway={() => stopEditing(false)}>
      <MenuList
        autoFocus={!originalValue}
        sx={{
          maxHeight: '50vh',
          overflowY: 'auto',
          backgroundColor: 'background.paper',
        }}
      >
        {options?.map((option, index) => {
          if (Array.isArray(option)) {
            return [
              index > 0 && <Divider />,
              option.map((singleOption) => getOption(singleOption)),
            ];
          }

          return getOption(option);
        })}
      </MenuList>
    </ClickAwayListener>
  );
}

export const TableSelect = forwardRef(TableSelectInner) as <
  TSelectOption extends OptionProps
>(
  props: TableSelectProps<TSelectOption> & {
    ref?: React.ForwardedRef<unknown>;
  }
) => ReturnType<typeof TableSelectInner>;
