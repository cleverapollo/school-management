// form
import { useFormContext, Controller, Control } from 'react-hook-form';
// @mui
import { Switch, FormControlLabel, FormControlLabelProps } from '@mui/material';

// ----------------------------------------------------------------------

type IProps = Omit<FormControlLabelProps, 'control'>;

interface Props extends IProps {
  name: string;
  customControl?: Control<any, any>;
}

export default function RHFSwitch({ name, customControl, ...other }: Props) {
  const context = useFormContext();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={customControl ?? context?.control}
          render={({ field }) => <Switch {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}
