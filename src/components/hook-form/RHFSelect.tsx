// form
import { useFormContext, Controller, Control } from 'react-hook-form';
// @mui
import { TextField, TextFieldProps } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = {
  name: string;
  children: React.ReactNode;
  customControl?: Control<any, any>;
};

type Props = IProps & TextFieldProps;

export default function RHFSelect({ name, children, customControl, ...other }: Props) {
  const context = useFormContext();

  return (
    <Controller
      name={name}
      control={customControl ?? context?.control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          SelectProps={{ native: false }}
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
