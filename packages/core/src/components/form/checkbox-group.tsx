import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { CheckboxGroup, CheckboxGroupProps } from '../checkbox-group';

type RHFCheckboxGroupProps<TField extends FieldValues, TCheckboxGroupOption> = {
  controlProps: UseControllerProps<TField>;
  value?: CheckboxGroupProps<TCheckboxGroupOption>['value'];
  onChange?: CheckboxGroupProps<TCheckboxGroupOption>['onChange'];
} & Omit<CheckboxGroupProps<TCheckboxGroupOption>, 'value' | 'onChange'>;

export const RHFCheckboxGroup = <
  TField extends FieldValues,
  TCheckboxGroupOption extends string | number | object
>({
  controlProps,
  ...checkboxGroupProps
}: RHFCheckboxGroupProps<TField, TCheckboxGroupOption>) => {
  const {
    field: { ref, value, ...restFieldProps },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <CheckboxGroup<TCheckboxGroupOption>
      {...restFieldProps}
      {...checkboxGroupProps}
      customRef={ref}
      value={value ?? []}
      error={!!error}
      helperText={error?.message}
    />
  );
};
