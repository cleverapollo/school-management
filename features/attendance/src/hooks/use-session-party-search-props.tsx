import { AutocompleteProps, useDebouncedValue } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Search } from '@tyro/api';
import { useSessionPartySearch } from '../api/session-party-search';

export type SessionParty = Pick<Search, 'partyId' | 'text' | 'avatarUrl'> & {
  type?: Search['type'];
};

export const useSessionPartySearchProps = (
  customProps?: Partial<AutocompleteProps<SessionParty, true>>
): AutocompleteProps<SessionParty, true> => {
  const { t } = useTranslation(['common', 'attendance']);

  const {
    value: searchValue,
    setValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });

  const { data: options, isLoading } =
    useSessionPartySearch(debouncedSearchValue);

  return {
    label: t('common:search'),
    optionIdKey: 'partyId',
    optionTextKey: 'text',
    placeholder: t('attendance:studentsClassGroupsEtc'),
    multiple: true,
    open: searchValue.length > 0,
    filterSelectedOptions: true,
    clearOnBlur: true,
    filterOptions: (x) => x,
    freeSolo: true,
    loading: isLoading,
    options: options ?? [],
    onInputChange: (_, newInputValue) => setSearchValue(newInputValue),
    renderAvatarTags: (option, renderTag) =>
      renderTag({
        name: option.text,
        src: option.avatarUrl ?? undefined,
      }),
    renderAvatarOption: (option, renderOption) =>
      renderOption({
        name: option.text,
        src: option.avatarUrl ?? undefined,
        caption: option.type ? t(`common:searchType.${option.type}`) : '',
      }),
    ...customProps,
  };
};
