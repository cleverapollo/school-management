import { FormControlLabel, Switch, SwitchProps } from '@mui/material';
import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type RHFSwitchProps<TField extends FieldValues> = {
  label?: string;
  switchProps?: SwitchProps;
  controlProps: UseControllerProps<TField>;
};

export const RHFSwitch = <TField extends FieldValues>({
  label,
  switchProps,
  controlProps,
}: RHFSwitchProps<TField>) => {
  const { field } = useController(controlProps);

  return (
    <FormControlLabel
      label={label}
      control={<Switch {...switchProps} {...field} checked={!!field.value} />}
    />
  );
};
