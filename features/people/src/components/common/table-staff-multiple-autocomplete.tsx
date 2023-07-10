import {
  ICellEditorParams,
  Autocomplete,
  usePreferredNameLayout,
} from '@tyro/core';

import { forwardRef, ForwardedRef, useImperativeHandle, useState } from 'react';
import { UseQueryReturnType } from '@tyro/api';
import { useStaffForSelect } from '../../api/staff';

type ReturnTypeFromUseStaffForSelect = UseQueryReturnType<
  typeof useStaffForSelect
>[number];

export const TableStaffMultipleAutocomplete = forwardRef(
  (
    props: ICellEditorParams<unknown, ReturnTypeFromUseStaffForSelect[] | null>,
    ref: ForwardedRef<unknown>
  ) => {
    const { data, isLoading } = useStaffForSelect({});
    const { displayName } = usePreferredNameLayout();

    const [localSelectedValue, setLocalSelectedValue] = useState(props.value);

    useImperativeHandle(ref, () => ({
      getValue() {
        return localSelectedValue;
      },
    }));

    return (
      <Autocomplete<ReturnTypeFromUseStaffForSelect>
        loading={isLoading}
        multiple
        customRef={ref}
        optionIdKey="partyId"
        optionTextKey="firstName"
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
        renderAvatarOption={(option, renderOption) =>
          renderOption({
            name: displayName(option),
          })
        }
        renderAvatarTags={(option, renderTag) =>
          renderTag({
            name: displayName(option) || undefined,
            src: option.avatarUrl,
          })
        }
      />
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableStaffMultipleAutocomplete.displayName = 'TableStaffMultipleAutocomplete';
}
