import { ICellEditorParams, TableAutocomplete } from '@tyro/core';
import { Stack, Typography } from '@mui/material';
import { forwardRef, ForwardedRef, useImperativeHandle, useRef } from 'react';
import { useTranslation } from '@tyro/i18n';
import { useCoreRooms, ReturnTypeFromUseCoreRooms } from '../../api/rooms';

export const TableTimetableAutocomplete = forwardRef(
  (
    props: ICellEditorParams<unknown, ReturnTypeFromUseCoreRooms | null>,
    ref: ForwardedRef<unknown>
  ) => {
    const autoCompleteRef = useRef<{
      getValue: () => ReturnTypeFromUseCoreRooms | null;
    }>();
    const { t } = useTranslation(['common']);
    const { data: roomData, isLoading } = useCoreRooms();

    useImperativeHandle(ref, () => ({
      getValue() {
        return autoCompleteRef?.current?.getValue();
      },
    }));

    return (
      <TableAutocomplete
        ref={autoCompleteRef}
        {...props}
        value={props.value}
        options={roomData ?? []}
        getOptionLabel={(option) => option?.name}
        optionIdKey="roomId"
        AutocompleteProps={{
          autoHighlight: true,
          loading: isLoading,
          loadingText: t('common:loading'),
          renderOption: (optionProps, option) => (
            <Stack component="li" direction="row" spacing={1} {...optionProps}>
              <Typography variant="subtitle2">{option?.name}</Typography>
            </Stack>
          ),
        }}
      />
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  TableTimetableAutocomplete.displayName = 'TableTimetableAutocomplete';
}
