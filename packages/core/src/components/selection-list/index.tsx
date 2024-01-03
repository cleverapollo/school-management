import { Stack } from '@mui/material';
import { SelectListDropArea } from './drop-area';
import { SelectionListProvider } from './store';

type SelectionListProps<T extends object | string> = {
  value: T[];
  onChange: (value: T[]) => void;
  options: T[];
  optionIdKey?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  optionTextKey?: T extends object ? keyof T : never;
  groupBy?: T extends object
    ? keyof T | ((option: T) => string)
    : (option: T) => string;
  collapsibleGroups?: boolean;
  getOptionLabel?: (option: T) => string;
  showSearch?: boolean;
  firstColumnLabel?: string;
  secondColumnLabel?: string;
};

export const SelectionList = <T extends object | string>({
  value,
  onChange,
  options,
  optionIdKey,
  optionTextKey,
  groupBy,
  collapsibleGroups,
  getOptionLabel: externalGetOptionLabel,
  showSearch,
  firstColumnLabel,
  secondColumnLabel,
}: SelectionListProps<T>) => (
  <SelectionListProvider
    value={value}
    onChange={onChange}
    options={options}
    optionIdKey={optionIdKey}
    optionTextKey={optionTextKey}
    getOptionLabel={externalGetOptionLabel}
    groupBy={groupBy}
    collapsibleGroups={collapsibleGroups}
    showSearch={showSearch}
  >
    <Stack direction="row" spacing={2}>
      <SelectListDropArea
        droppableId="unselected"
        label={firstColumnLabel ?? 'Unselected'}
      />
      <SelectListDropArea
        droppableId="selected"
        label={secondColumnLabel ?? 'Selected'}
      />
    </Stack>
  </SelectionListProvider>
);
