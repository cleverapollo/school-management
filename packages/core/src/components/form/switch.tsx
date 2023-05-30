import {
  FormControlLabel,
  FormControlLabelProps,
  Switch,
  SwitchProps,
} from '@mui/material';
import {
  FieldValues,
  Path,
  PathValue,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type RHFSwitchProps<TField extends FieldValues> = {
  label?: FormControlLabelProps['label'];
  switchProps?: SwitchProps;
  controlLabelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
  controlProps: UseControllerProps<TField>;
};

export const RHFSwitch = <TField extends FieldValues>({
  label,
  controlLabelProps,
  switchProps,
  controlProps,
}: RHFSwitchProps<TField>) => {
  const { field } = useController({
    ...controlProps,
    defaultValue: !!controlProps.defaultValue as PathValue<
      TField,
      Path<TField>
    >,
  });

  return (
    <FormControlLabel
      {...controlLabelProps}
      label={label}
      control={
        <Switch
          {...switchProps}
          {...field}
          checked={!!field.value}
          onChange={(...args) => {
            field.onChange(...args);
            switchProps?.onChange?.(...args);
          }}
        />
      }
    />
  );
};
