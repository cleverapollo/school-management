import {
  FieldValues,
  useController,
  UseControllerProps,
} from 'react-hook-form';
import { ColorPicker, ColorPickerProps } from '../color-picker';

type RHFColorPickerProps<TField extends FieldValues> = {
  label?: string;
  pickerProps?: ColorPickerProps;
  controlProps: UseControllerProps<TField>;
};

export const RHFColorPicker = <TField extends FieldValues>({
  label,
  pickerProps,
  controlProps,
}: RHFColorPickerProps<TField>) => {
  const {
    field,
    fieldState: { error },
  } = useController(controlProps);

  return (
    <ColorPicker
      {...pickerProps}
      {...field}
      value={field.value ?? ''}
      label={label}
      error={!!error}
      helperText={error?.message}
    />
  );
};
