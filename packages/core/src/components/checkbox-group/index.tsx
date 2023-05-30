import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import { useId } from 'react';

export interface CheckboxGroupProps<TCheckboxGroupOption> {
  options: TCheckboxGroupOption[];
  getOptionLabel: (option: TCheckboxGroupOption) => string;
  optionIdKey?: TCheckboxGroupOption extends string | number
    ? never
    : keyof TCheckboxGroupOption;
  name?: string;
  value: string[];
  label: string;
  onChange: (value: string[]) => void;
  customRef?: React.Ref<HTMLInputElement>;
  onBlur?: () => void;
  error?: boolean;
  helperText?: string;
}

export const CheckboxGroup = <
  TCheckboxGroupOption extends string | number | object
>({
  options,
  getOptionLabel,
  optionIdKey,
  name,
  value = [],
  onChange,
  label,
  customRef,
  onBlur,
  error,
  helperText,
}: CheckboxGroupProps<TCheckboxGroupOption>) => {
  const randomName = useId();
  const fieldName = name ?? randomName;

  const toggleValue = (option: string) => {
    if (value.includes(option)) {
      onChange?.(value.filter((v) => v !== option));
    } else {
      onChange?.([...value, option]);
    }
  };

  return (
    <FormControl component="fieldset" variant="standard" error={error}>
      <FormLabel component="legend">{label}</FormLabel>
      <FormGroup ref={customRef} onBlur={onBlur}>
        {options.map((option, index) => {
          const optionValue = optionIdKey
            ? (option[optionIdKey] as string)
            : String(option);

          return (
            <FormControlLabel
              key={optionValue}
              control={
                <Checkbox
                  checked={value.includes(optionValue)}
                  onChange={() => toggleValue(optionValue)}
                  name={`${fieldName}.${index}`}
                />
              }
              label={getOptionLabel(option)}
            />
          );
        })}
      </FormGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
