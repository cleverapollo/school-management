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
        '& .MuiAutocomplete-input': {
          minWidth: '0 !important',
          width: `${
            (autoCompleteProps.inputValue?.length ?? 0) + 2
          }ch !important`,
        },
        '& .MuiFormControl-root': {
          flexDirection: 'row',
          alignItems: 'center',
        },
        '& .MuiFormLabel-root': {
          position: 'relative',
          textOverflow: 'initial',
          transformOrigin: 'initial',
          overflow: 'initial',
          transform: 'initial',
          transition: 'initial',
          lineHeight: '2rem',
          pr: 0.5,
          color: `${theme.palette.slate[500]} !important`,
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
          ...props?.inputProps?.InputLabelProps,
        },
      }}
    />
  );
};
