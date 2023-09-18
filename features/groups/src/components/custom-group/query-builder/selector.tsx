import {
  Select,
  useTheme,
  ListSubheader,
  MenuItem,
  SelectProps,
} from '@mui/material';
import {
  useValueSelector,
  isOptionGroupArray,
  OptionList,
  VersatileSelectorProps,
} from 'react-querybuilder';

const toOptions = (arr: OptionList) => {
  if (isOptionGroupArray(arr)) {
    return arr.flatMap((og) => [
      <ListSubheader key={og.label}>{og.label}</ListSubheader>,
      ...og.options.map((opt) => (
        <MenuItem key={opt.name} value={opt.name}>
          {opt.label}
        </MenuItem>
      )),
    ]);
  }

  if (Array.isArray(arr)) {
    return arr.map((opt) => (
      <MenuItem key={opt.name} value={opt.name}>
        {opt.label}
      </MenuItem>
    ));
  }

  return null;
};

type SelectorProps = VersatileSelectorProps & {
  sx?: SelectProps['sx'];
};

export const Selector = ({
  handleOnChange,
  options,
  value,
  multiple,
  listsAsArrays,
  sx,
}: SelectorProps) => {
  const { palette } = useTheme();

  const { onChange, val } = useValueSelector({
    handleOnChange,
    listsAsArrays,
    multiple,
    value,
  });

  return (
    <Select
      size="small"
      multiple={multiple}
      value={val}
      sx={{
        ...sx,
        flex: 1,
        '& .MuiSelect-select': {
          backgroundColor: palette.background.paper,
        },
      }}
      onChange={(ev) => {
        onChange(ev.target.value as string);
      }}
    >
      {toOptions(options ?? [])}
    </Select>
  );
};
