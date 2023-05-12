import { Chip } from '@mui/material';
import { FieldValues } from 'react-hook-form';
import { RHFAutocomplete, RHFAutocompleteProps } from './autocomplete';

type RHFSelectionListProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, string, true>,
  'multiple' | 'options' | 'freeSolo' | 'renderTags'
>;

/**
 * TODO: check if this is still needed
 *
 * For now, there is no a use case where this component can be used.
 * */

export const RHFSelectionList = <TField extends FieldValues>({
  inputProps,
  ...restProps
}: RHFSelectionListProps<TField>) => (
  <RHFAutocomplete<TField, string, true>
    {...restProps}
    inputProps={inputProps}
    options={[]}
    multiple
    freeSolo
    autoSelect
    onInputChange={(event, newInputValue) => {
      const target = event.target as HTMLInputElement;
      if (target && newInputValue.endsWith(',')) {
        target.blur();
        target.focus();
      }
    }}
    renderTags={(value, getTagProps) =>
      value.map((option, index) => (
        <Chip
          {...restProps?.ChipProps}
          {...getTagProps({ index })}
          label={option}
        />
      ))
    }
  />
);
