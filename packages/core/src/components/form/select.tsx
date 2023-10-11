import { IconButton } from '@mui/material';
import { CloseIcon } from '@tyro/icons';
import { ChangeEvent } from 'react';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Select, SelectProps } from '../select';

export type RHFSelectProps<
  TField extends FieldValues,
  TSelectOption extends string | number | object
> = {
  controlProps: UseControllerProps<TField>;
  canDeleteValue?: boolean;
} & SelectProps<TSelectOption>;

export const RHFSelect = <
  TField extends FieldValues,
  TSelectOption extends string | number | object
>({
  controlProps,
  canDeleteValue = false,
  ...selectProps
}: RHFSelectProps<TField, TSelectOption>) => {
  const {
    field: { ref, value, onChange, ...restFieldProps },
    fieldState: { error },
  } = useController(controlProps);

  const onRemoveValue = () => {
    const mockEvent = {
      target: {
        value: null,
      },
    } as unknown as ChangeEvent<HTMLInputElement>;
    onChange(mockEvent);
    selectProps.onChange?.(mockEvent);
  };

  return (
    <Select<TSelectOption>
      {...restFieldProps}
      {...selectProps}
      onChange={(e) => {
        onChange(e);
        selectProps.onChange?.(e);
      }}
      InputProps={{
        ...selectProps.InputProps,
        endAdornment: canDeleteValue && value && (
          <IconButton
            size="small"
            sx={{ mr: 2.5 }}
            type="button"
            onClick={onRemoveValue}
          >
            <CloseIcon />
          </IconButton>
        ),
      }}
      customSelectRef={ref}
      value={value ?? ''}
      error={!!error}
      helperText={error?.message}
    />
  );
};
