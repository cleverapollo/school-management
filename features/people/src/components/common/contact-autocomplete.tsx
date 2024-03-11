import { FieldValues } from 'react-hook-form';
import {
  Autocomplete,
  AutocompleteProps,
  RHFAutocomplete,
  RHFAutocompleteProps,
} from '@tyro/core';
import { StudentContactFilter } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { usePeopleAutocompleteProps } from './use-people-autocomplete-props';
import {
  useContactsForSelect,
  ReturnTypeFromUseContactsForSelect,
} from '../../api/contact/list';

type RHFContactAutocompleteProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, ReturnTypeFromUseContactsForSelect>,
  'options'
> & { contactsFilter?: StudentContactFilter };

type ContactAutocompleteProps = Omit<
  AutocompleteProps<ReturnTypeFromUseContactsForSelect>,
  'options'
> & { contactsFilter?: StudentContactFilter };

export const RHFContactAutocomplete = <TField extends FieldValues>({
  contactsFilter,
  ...props
}: RHFContactAutocompleteProps<TField>) => {
  const { t } = useTranslation(['people']);
  const { data: contactData = [], isLoading } = useContactsForSelect(
    contactsFilter ?? {}
  );
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<ReturnTypeFromUseContactsForSelect>();

  return (
    <RHFAutocomplete<TField, ReturnTypeFromUseContactsForSelect>
      label={t('people:searchForAContact')}
      {...peopleAutocompleteProps}
      fullWidth
      loading={isLoading}
      options={contactData ?? []}
      {...props}
    />
  );
};

export const ContactAutocomplete = ({
  contactsFilter,
  ...props
}: ContactAutocompleteProps) => {
  const { t } = useTranslation(['common']);
  const { data: contactData = [], isLoading } = useContactsForSelect(
    contactsFilter ?? {}
  );
  const peopleAutocompleteProps =
    usePeopleAutocompleteProps<ReturnTypeFromUseContactsForSelect>();

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
