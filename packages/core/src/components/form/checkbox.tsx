import {
  Checkbox,
  FormControlLabel,
  FormControlLabelProps,
  CheckboxProps,
} from '@mui/material';
import {
  FieldValues,
  Path,
  PathValue,
  useController,
  UseControllerProps,
} from 'react-hook-form';

type RHFCheckboxProps<TField extends FieldValues> = {
  label?: FormControlLabelProps['label'];
  checkboxProps?: CheckboxProps;
  controlLabelProps?: Omit<FormControlLabelProps, 'label' | 'control'>;
  controlProps: UseControllerProps<TField>;
};

export const RHFCheckbox = <TField extends FieldValues>({
  label,
  controlLabelProps,
  checkboxProps,
  controlProps,
}: RHFCheckboxProps<TField>) => {
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
        <Checkbox
          {...checkboxProps}
          {...field}
          checked={!!field.value}
          onChange={(...args) => {
            field.onChange(...args);
            checkboxProps?.onChange?.(...args);
          }}
        />
      }
    />
  );
};
