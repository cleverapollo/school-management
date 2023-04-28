import {
  ICellEditorParams,
  TableAutocomplete,
  usePreferredNameLayout,
  Avatar,
} from '@tyro/core';
import { Stack, Typography } from '@mui/material';
import { forwardRef, ForwardedRef, useImperativeHandle, useRef } from 'react';
import { UseQueryReturnType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useStaffForSelect } from '../../api/staff';

type ReturnTypeFromUseStaffForSelect = UseQueryReturnType<
  typeof useStaffForSelect
>[number];

export const TableStaffAutocomplete = forwardRef(
  (
    props: ICellEditorParams<unknown, ReturnTypeFromUseStaffForSelect[] | null>,
    ref: ForwardedRef<unknown>
  ) => {
    const autoCompleteRef = useRef<{
      getValue: () => ReturnTypeFromUseStaffForSelect[] | null;
      afterGuiAttached: () => void;
    }>();
    const { t } = useTranslation(['common']);
    const { data, isLoading } = useStaffForSelect({});
    const { displayName } = usePreferredNameLayout();

    useImperativeHandle(ref, () => ({
      getValue() {
        const value = autoCompleteRef?.current?.getValue();

        return !value ? [] : [value];
      },
    }));

    return (
      <TableAutocomplete
        ref={autoCompleteRef}
        {...props}
        value={
          Array.isArray(props.value) && props.value.length > 0
            ? props.value[0]
            : null
        }
        options={data ?? []}
        getOptionLabel={(option) => displayName(option)}
        optionIdKey="partyId"
        AutocompleteProps={{
          autoHighlight: true,
          loading: isLoading,
          loadingText: t('common:loading'),
          renderOption: (optionProps, option) => {
            const name = displayName(option);
            return (
              <Stack
                component="li"
                direction="row"
                spacing={1}
                {...optionProps}
              >
                <Avatar
                  name={name}
                  src={option.avatarUrl ?? undefined}
                  sx={{ width: 32, height: 32, fontSize: '0.75rem' }}
                />
                <Stack>
                  <Typography variant="subtitle2">{name}</Typography>
                </Stack>
              </Stack>
            );
          },
        }}
      />
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableStaffAutocomplete.displayName = 'TableStaffAutocomplete';
}
