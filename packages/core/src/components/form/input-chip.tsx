import { Chip } from '@mui/material';
import { FieldValues } from 'react-hook-form';
import { RHFAutocomplete, RHFAutocompleteProps } from './autocomplete';

type CustomAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, string>['autocompleteProps'],
  'multiple' | 'options' | 'freeSolo' | 'renderTags'
>;

type RHFInputChipProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, string>,
  'autocompleteProps'
> & {
  autocompleteProps?: CustomAutocompleteProps<TField>;
};

export const RHFInputChip = <TField extends FieldValues>({
  autocompleteProps,
  inputProps,
  ...restProps
}: RHFInputChipProps<TField>) => (
  <RHFAutocomplete<TField, string>
    {...restProps}
    inputProps={inputProps}
    autocompleteProps={{
      ...autocompleteProps,
      options: [],
      multiple: true,
      freeSolo: true,
      autoSelect: true,
      onInputChange: (event, newInputValue) => {
        const target = event.target as HTMLInputElement;
        if (target && newInputValue.endsWith(',')) {
          target.blur();
          target.focus();
        }
      },
      renderTags: (value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...autocompleteProps?.ChipProps}
            {...getTagProps({ index })}
            label={option}
          />
        )),
    }}
  />
);
