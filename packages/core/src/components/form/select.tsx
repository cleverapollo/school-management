import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Select, SelectProps } from '../select';

export type RHFSelectProps<
  TField extends FieldValues,
  TSelectOption extends string | number | object
> = {
  controlProps: UseControllerProps<TField>;
} & SelectProps<TSelectOption>;

export const RHFSelect = <
  TField extends FieldValues,
  TSelectOption extends string | number | object
>({
  controlProps,
  ...selectProps
}: RHFSelectProps<TField, TSelectOption>) => {
  const {
    field: { ref, value, onChange, ...restFieldProps },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <Select<TSelectOption>
      {...restFieldProps}
      {...selectProps}
      onChange={(e) => {
        onChange(e);
        selectProps.onChange?.(e);
      }}
      customSelectRef={ref}
      value={value ?? ''}
      error={!!error}
      helperText={error?.message}
    />
  );
};
