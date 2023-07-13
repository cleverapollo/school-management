import { AutocompleteProps, usePreferredNameLayout } from '@tyro/core';
import { Person } from '@tyro/api';

type PersonAutocomplete = Omit<Person, '__typename'> & { caption?: string };

export const usePeopleAutocompleteProps = <
  T extends PersonAutocomplete
>(): Pick<
  AutocompleteProps<T>,
  | 'optionIdKey'
  | 'getOptionLabel'
  | 'filterOptions'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
> => {
  const { displayName } = usePreferredNameLayout();

  return {
    optionIdKey: 'partyId',
    getOptionLabel: (option) => displayName(option),
    filterOptions: (options, { inputValue }) => {
      if (!inputValue) {
        return options;
      }

      const splitInputValue = inputValue.toLowerCase().split(' ');

      return options.filter((option) => {
        const studentName = displayName(option).toLowerCase();
        return splitInputValue.every((string) => studentName.includes(string));
      });
    },
    renderAvatarAdornment: (value, renderAdornment) =>
      renderAdornment({
        name: displayName(value),
        src: value.avatarUrl,
      }),
    renderAvatarTags: (option, renderTag) =>
      renderTag({
        name: displayName(option),
        src: option.avatarUrl ?? undefined,
      }),
    renderAvatarOption: (option, renderOption) =>
      renderOption({
        name: displayName(option),
        src: option.avatarUrl ?? undefined,
        ...(option.caption && { caption: option.caption }),
      }),
  };
};
