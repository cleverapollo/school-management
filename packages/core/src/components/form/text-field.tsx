import { TextField, TextFieldProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

export type RHFTextFieldProps<TField extends FieldValues> = {
  label?: string;
  type?: string;
  textFieldProps?: TextFieldProps;
  controlProps: UseControllerProps<TField>;
};

export const RHFTextField = <TField extends FieldValues>({
  label,
  type,
  textFieldProps,
  controlProps,
}: RHFTextFieldProps<TField>) => {
  const {
    field,
    fieldState: { error },
  } = useController(controlProps);

  return (
    <TextField
      {...textFieldProps}
      {...field}
      value={field.value ?? ''}
      label={label}
      type={type}
      error={!!error}
      helperText={error?.message}
    />
  );
};
