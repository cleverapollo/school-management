import { TextField, TextFieldProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

export type RHFTextFieldProps<TField extends FieldValues> = {
  label?: string;
  textFieldProps?: TextFieldProps;
  controlProps: UseControllerProps<TField>;
};

export const RHFTextField = <TField extends FieldValues>({
  label,
  textFieldProps,
  controlProps,
}: RHFTextFieldProps<TField>) => {
  const {
    field: { ref, value, ...restField },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <TextField
      {...textFieldProps}
      {...restField}
      value={value ?? ''}
      label={label}
      error={!!error}
      helperText={error?.message}
      inputRef={ref}
    />
  );
};
