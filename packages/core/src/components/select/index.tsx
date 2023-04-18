import {
  MenuItem,
  TextField,
  TextFieldProps,
  createTheme,
} from '@mui/material';

type SelectObjectOption<TSelectOption> = {
  optionIdKey: keyof TSelectOption;
};

type SelectSimpleOption = {
  optionIdKey?: never;
};

export type SelectProps<TSelectOption> = TextFieldProps & {
  options: TSelectOption[];
  getOptionLabel: (option: TSelectOption) => string;
  customSelectRef?: TextFieldProps['ref'];
} & (TSelectOption extends string | number
    ? SelectSimpleOption
    : SelectObjectOption<TSelectOption>);

const theme = createTheme();
const DEFAULT_MAX_HEIGHT = theme.spacing(44);

export const Select = <TSelectOption extends string | number | object>({
  options,
  optionIdKey,
  customSelectRef,
  getOptionLabel,
  ...textFieldProps
}: SelectProps<TSelectOption>) => (
  <TextField
    {...textFieldProps}
    ref={customSelectRef}
    select
    SelectProps={{
      ...textFieldProps.SelectProps,
      MenuProps: {
        ...textFieldProps.SelectProps?.MenuProps,
        sx: {
          maxHeight: DEFAULT_MAX_HEIGHT,
          ...textFieldProps.SelectProps?.MenuProps?.sx,
        },
      },
    }}
  >
    {options.map((option) => {
      const value = optionIdKey
        ? (option[optionIdKey] as string)
        : String(option);

      return (
        <MenuItem key={value} value={value}>
          {getOptionLabel(option)}
        </MenuItem>
      );
    })}
  </TextField>
);
