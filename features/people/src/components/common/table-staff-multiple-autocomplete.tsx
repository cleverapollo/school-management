import { ICellEditorParams, Autocomplete } from '@tyro/core';

import { forwardRef, ForwardedRef, useImperativeHandle, useState } from 'react';
import { UseQueryReturnType } from '@tyro/api';
import { useStaffForSelect } from '../../api/staff';
import { usePeopleAutocompleteProps } from './use-people-autocomplete-props';

type ReturnTypeFromUseStaffForSelect = UseQueryReturnType<
  typeof useStaffForSelect
>[number];

export const TableStaffMultipleAutocomplete = forwardRef(
  (
    props: ICellEditorParams<unknown, ReturnTypeFromUseStaffForSelect[] | null>,
    ref: ForwardedRef<unknown>
  ) => {
    const { data, isLoading } = useStaffForSelect({});

    const [localSelectedValue, setLocalSelectedValue] = useState(props.value);
    const peopleAutocompleteProps =
      usePeopleAutocompleteProps<ReturnTypeFromUseStaffForSelect>();

    useImperativeHandle(ref, () => ({
      getValue() {
        return localSelectedValue;
      },
    }));

    return (
      <Autocomplete<ReturnTypeFromUseStaffForSelect>
        {...peopleAutocompleteProps}
        loading={isLoading}
        multiple
        customRef={ref}
        fullWidth
        sx={{
          width: '100%',
          height: '100%',
          '& fieldset': {
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
        value={localSelectedValue ?? []}
        onChange={(_, value) => {
          setLocalSelectedValue(value as ReturnTypeFromUseStaffForSelect[]);
        }}
        inputProps={{ autoFocus: true }}
        openOnFocus
        options={data ?? []}
      />
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableStaffMultipleAutocomplete.displayName = 'TableStaffMultipleAutocomplete';
}
