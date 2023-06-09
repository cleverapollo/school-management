import {
  ICellEditorParams,
  Autocomplete,
  usePreferredNameLayout,
} from '@tyro/core';

import { forwardRef, ForwardedRef, useImperativeHandle, useState } from 'react';
import { UseQueryReturnType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useStaffForSelect } from '@tyro/people';

type ReturnTypeFromUseStaffForSelect = UseQueryReturnType<
  typeof useStaffForSelect
>[number];

export const TableStaffMultipleAutocomplete = forwardRef(
  (
    props: ICellEditorParams<unknown, ReturnTypeFromUseStaffForSelect[] | null>,
    ref: ForwardedRef<unknown>
  ) => {
    const { t } = useTranslation(['common']);
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
        multiple
        customRef={ref}
        optionIdKey="partyId"
        optionTextKey="firstName"
        fullWidth
        value={localSelectedValue ?? []}
        onChange={(event, value) => {
          setLocalSelectedValue(value as ReturnTypeFromUseStaffForSelect[]);
        }}
        options={data ?? []}
        renderAvatarOption={(option, renderOption) =>
          renderOption({
            name: displayName(option),
            src: undefined,
          })
        }
        renderAvatarTags={(option, renderTag) =>
          renderTag({
            name: option?.firstName || undefined,
            src: option.avatarUrl || undefined,
          })
        }
      />
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableStaffMultipleAutocomplete.displayName = 'TableStaffMultipleAutocomplete';
}
