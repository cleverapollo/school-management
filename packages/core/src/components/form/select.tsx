import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { Select, SelectProps } from '../select';

type RHFSelectProps<TField extends FieldValues, TSelectOption> = {
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
    field: { ref, value, ...restFieldProps },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <Select<TSelectOption>
      {...restFieldProps}
      {...selectProps}
      customSelectRef={ref}
      value={value ?? ''}
      error={!!error}
      helperText={error?.message}
    />
  );
};
