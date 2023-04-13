import { MenuItem, TextField, TextFieldProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type SelectObjectOption<TSelectOption> = {
  optionIdKey: keyof TSelectOption;
};

type SelectSimpleOption = {
  optionIdKey?: never;
};

type SelectBaseProps<TField extends FieldValues, TSelectOption> = {
  label?: string;
  textFieldProps?: TextFieldProps;
  controlProps: UseControllerProps<TField>;
  options: TSelectOption[];
  getOptionLabel: (option: TSelectOption) => string;
};

type RHFSelectProps<
  TField extends FieldValues,
  TSelectOption
> = (TSelectOption extends string | number
  ? SelectSimpleOption
  : SelectObjectOption<TSelectOption>) &
  SelectBaseProps<TField, TSelectOption>;

export const RHFSelect = <TField extends FieldValues, TSelectOption>({
  label,
  options,
  optionIdKey,
  textFieldProps,
  controlProps,
  getOptionLabel,
}: RHFSelectProps<TField, TSelectOption>) => {
  const {
    field,
    fieldState: { error },
  } = useController(controlProps);

  return (
    <TextField
      {...textFieldProps}
      {...field}
      select
      value={field.value ?? ''}
      label={label}
      error={!!error}
      helperText={error?.message}
    >
      {options.map((option) => {
        const value = optionIdKey
          ? (option[optionIdKey] as string)
          : String(option);

        return (
          <MenuItem key={value} value={value}>
            {getOptionLabel(option)}
          </MenuItem>
        );
      })}
    </TextField>
  );
};
