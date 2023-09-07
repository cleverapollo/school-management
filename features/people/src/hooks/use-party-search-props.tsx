import { AutocompleteProps, useDebouncedValue } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { CalendarParty } from '@tyro/calendar';
import { usePartySearch } from '../api/common/party-search';

export const usePartySearchProps = (
  customProps?: Partial<AutocompleteProps<CalendarParty, true>>
): AutocompleteProps<CalendarParty, true> => {
  const { t } = useTranslation(['common', 'calendar']);

  const {
    value: searchValue,
    setValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });

  const { data: options, isLoading } = usePartySearch(debouncedSearchValue);

  return {
    label: t('calendar:inputLabels.participants'),
    optionIdKey: 'partyId',
    optionTextKey: 'text',
    placeholder: t('calendar:placeholders.partyTypeParticipants'),
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
