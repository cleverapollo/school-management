import { AutocompleteProps, RHFAutocomplete } from '@tyro/core';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { ReturnTypeUseMailSearch } from '../../api/mail-search';
import { useMailSearchProps } from '../../hooks/use-mail-search-props';

interface RHFMailSearchProps<TField extends FieldValues>
  extends Partial<AutocompleteProps<ReturnTypeUseMailSearch, true>> {
  controlProps: UseControllerProps<TField, any>;
}

export const RHFMailSearch = <TField extends FieldValues>({
  controlProps,
  ...props
}: RHFMailSearchProps<TField>) => {
  const autoCompleteProps = useMailSearchProps(props);

  return (
    <RHFAutocomplete<TField, ReturnTypeUseMailSearch, true>
      controlProps={controlProps}
      clearIcon={null}
      sx={(theme) => ({
        padding: theme.spacing(0.5, 3),
        borderBottom: `solid 1px ${theme.palette.divider}`,
        '& .MuiInputBase-root': {
          mt: 0,
        },
      })}
      {...autoCompleteProps}
      inputProps={{
        variant: 'standard',
        ...props?.inputProps,
        InputProps: {
          disableUnderline: true,
          ...props?.inputProps?.InputProps,
        },
        InputLabelProps: {
          shrink: true,
          sx: {
            visibility: 'hidden',
            width: 0,
            height: 0,
          },
          ...props?.inputProps?.InputLabelProps,
        },
      }}
    />
  );
};
