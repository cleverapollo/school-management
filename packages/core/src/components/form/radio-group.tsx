import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  FormLabel,
  Radio as MuiRadio,
  RadioGroup,
  RadioGroupProps,
} from '@mui/material';
import { ReactNode, useId } from 'react';
import {
  FieldValues,
  UseControllerProps,
  useController,
} from 'react-hook-form';

type RadioOption = {
  value: string;
  label: string;
};

type RHFRadioGroupProps<
  TField extends FieldValues,
  Option extends object | RadioOption
> = {
  label?: string;
  id?: string;
  controlProps: UseControllerProps<TField>;
  options: Option[];
  radioGroupProps?: RadioGroupProps;
  optionIdKey?: keyof Option;
  optionTextKey?: keyof Option;
  disabled?: boolean;
  renderOption?: (
    option: Option,
    renderRadio: (props: Partial<FormControlLabelProps>) => React.ReactNode
  ) => ReactNode;
};

export const RHFRadioGroup = <
  TField extends FieldValues,
  Option extends object | RadioOption
>({
  id,
  label,
  controlProps,
  radioGroupProps,
  options,
  optionIdKey = 'value' as keyof Option,
  optionTextKey = 'label' as keyof Option,
  renderOption,
  disabled,
}: RHFRadioGroupProps<TField, Option>) => {
  const autoId = useId();
  const radioId = id ?? autoId;

  const {
    field: { value, onChange, ...field },
    fieldState: { error },
  } = useController(controlProps);

  return (
    <FormControl error={!!error} disabled={disabled ?? false}>
      {label && <FormLabel id={radioId}>{label}</FormLabel>}

      <RadioGroup
        aria-labelledby={label ? radioId : undefined}
        aria-describedby={error ? `${radioId}-helper` : undefined}
        {...field}
        {...radioGroupProps}
        value={value ?? ''}
        onChange={(e, v) => {
          onChange(v);
          radioGroupProps?.onChange?.(e, v);
        }}
      >
        {options.map((option) => {
          const sharedProps = {
            value: option[optionIdKey],
            label: option[optionTextKey] as string,
            control: <MuiRadio />,
          };

          if (renderOption) {
            return renderOption(option, (props) => (
              <FormControlLabel {...props} {...sharedProps} />
            ));
          }

          return (
            <FormControlLabel
              {...sharedProps}
              key={option[optionIdKey] as string}
            />
          );
        })}
      </RadioGroup>
      {error?.message && (
        <FormHelperText id={`${radioId}-helper`}>
          {error?.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};
