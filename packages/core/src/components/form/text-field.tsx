import { TextField, TextFieldProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type RHFTextFieldProps<TField extends FieldValues> = {
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
    field,
    fieldState: { error },
  } = useController(controlProps);

  return (
    <TextField
      {...textFieldProps}
      {...field}
      value={field.value ?? ''}
      label={label}
      error={!!error}
      helperText={error?.message}
    />
  );
};
