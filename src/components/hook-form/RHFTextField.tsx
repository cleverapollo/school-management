// form
import { useFormContext, Controller, Control } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  customControl?: Control<any, any>;
};

type Props = IProps & TextFieldProps;

export default function RHFTextField({ name, customControl, ...other }: Props) {
  const context = useFormContext();

  return (
    <Controller
      name={name}
      control={customControl ?? context?.control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={typeof field.value === 'number' && field.value === 0 ? '' : field.value}
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  );
}
