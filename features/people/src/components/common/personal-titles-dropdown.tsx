import { FieldValues } from 'react-hook-form';
import { RHFAutocomplete, RHFAutocompleteProps } from '@tyro/core';
import {
  usePersonalTitles,
  PersonalTitleOption,
} from '../../api/common/personal-titles';

type PersonalTitlesDropdownProps<TField extends FieldValues> = Omit<
  RHFAutocompleteProps<TField, PersonalTitleOption>,
  'options'
>;

export const PersonalTitlesDropdown = <TField extends FieldValues>(
  props: PersonalTitlesDropdownProps<TField>
) => {
  const { data: personalTitlesData = [] } = usePersonalTitles();

  return (
    <RHFAutocomplete<TField, PersonalTitleOption>
      optionIdKey="id"
      optionTextKey="name"
      fullWidth
      options={personalTitlesData}
      {...props}
    />
  );
};
