import { ForwardedRef, forwardRef, useImperativeHandle, useRef } from 'react';
import { ICellEditorParams } from '@ag-grid-community/core';
import { Autocomplete, AutocompleteProps, Box } from '@mui/material';

export interface TableAutocompleteProps<TOption>
  extends ICellEditorParams<unknown, TOption | null> {
  options: TOption[];
  getOptionLabel?: (option: TOption) => string;
  optionIdKey?: TOption extends string | number ? never : keyof TOption;
  AutocompleteProps: Omit<
    AutocompleteProps<TOption, false, false, false>,
    'options' | 'renderInput'
  >;
}

function checkTableAutocompleteProps<TOption>(
  props: TableAutocompleteProps<TOption>
): asserts props is TableAutocompleteProps<TOption> {
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(props.options)) {
      throw new Error(
        `Please provide an array of options to cellEditorSelector.params.options for the TableAutocomplete component in the ${
          props?.colDef?.headerName ?? ''
        } column`
      );
    }

    if (typeof props.getOptionLabel !== 'function') {
      throw new Error(
        `Please provide a getOptionLabel function to cellEditorSelector.params.getOptionLabel for the TableAutocomplete component in the ${
          props?.colDef?.headerName ?? ''
        } column`
      );
    }

    if (!props.optionIdKey) {
      throw new Error(
        `Please provide a optionIdKey to cellEditorSelector.params.optionIdKey for the TableAutocomplete component in the ${
          props?.colDef?.headerName ?? ''
        } column`
      );
    }
  }
}

function TableAutocompleteInner<TOption>(
  props: TableAutocompleteProps<TOption>,
  ref: ForwardedRef<unknown>
) {
  const {
    value: originalValue,
    stopEditing,
    options = [],
    optionIdKey,
    getOptionLabel,
    AutocompleteProps: autocompleteProps,
  } = props;
  const selectedValue = useRef(originalValue);

  useImperativeHandle(ref, () => ({
    getValue() {
      return selectedValue.current;
    },
  }));

  checkTableAutocompleteProps(props);

  return (
    <Autocomplete
      ref={ref}
      sx={{
        width: '100%',
        height: '100%',
        '& input': {
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          outline: 'none',
          border: 'none',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          color: 'inherit',
          paddingX: 1,
        },
      }}
      renderInput={(params) => (
        <Box sx={{ height: '100%' }} ref={params.InputProps.ref}>
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            {...params.inputProps}
          />
        </Box>
      )}
      componentsProps={{
        popper: {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 4],
              },
            },
          ],
          sx: {
            minWidth: 280,
          },
        },
      }}
      onChange={(_, value) => {
        selectedValue.current = value;
        stopEditing();
      }}
      {...autocompleteProps}
      autoHighlight
      value={originalValue}
      options={options}
      openOnFocus
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, value) =>
        optionIdKey ? option[optionIdKey] === value[optionIdKey] : false
      }
    />
  );
}

export const TableAutocomplete = forwardRef(TableAutocompleteInner) as <
  TOption
>(
  props: TableAutocompleteProps<TOption> & {
    ref?: React.ForwardedRef<unknown>;
  }
) => ReturnType<typeof TableAutocompleteInner>;
