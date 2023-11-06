import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { UseQueryReturnType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { usePeopleAutocompleteProps } from './use-people-autocomplete-props';
import { useContactsForSelect } from '../../api/contact/list';

export type ContactSelectOption = UseQueryReturnType<
  typeof useContactsForSelect
>[number];

type RHFContactAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, ContactSelectOption>,
  'options'
>;

type ContactAutocompleteProps = Omit<
  AutocompleteProps<ContactSelectOption>,
  'options'
>;

export const RHFContactAutocomplete = <TField extends FieldValues>(
  props: RHFContactAutocompleteProps<TField>
) => {
  const { t } = useTranslation(['people']);
  const { data: contactData = [], isLoading } = useContactsForSelect();
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<ContactSelectOption>();

  return (
    <RHFAutocomplete<TField, ContactSelectOption>
      label={t('people:searchForAContact')}
      {...peopleAutocompleteProps}
      fullWidth
      loading={isLoading}
      options={contactData ?? []}
      {...props}
    />
  );
};

export const ContactAutocomplete = (props: ContactAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: contactData = [], isLoading } = useContactsForSelect();
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<ContactSelectOption>();

  return (
    <Autocomplete
      label={t('common:contact')}
      {...peopleAutocompleteProps}
      fullWidth
      loading={isLoading}
      options={contactData ?? []}
      {...props}
    />
  );
};
