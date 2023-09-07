import { AutocompleteProps, RHFAutocomplete } from '@tyro/core';
import { FieldValues, UseControllerProps } from 'react-hook-form';
import { ReturnTypeUseMailSearch } from '../api/mail-search';
import { useMailSearchProps } from '../hooks/use-mail-search-props';

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
      {...autoCompleteProps}
    />
  );
};
