import { AutocompleteProps, useDebouncedValue } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Search } from '@tyro/api';
import { useCalendarSearch } from '../api/calendar-search';

export type CalendarParty = Pick<
  Search,
  'partyId' | 'text' | 'type' | 'avatarUrl'
>;

export const useParticipantsSearchProps = (
  customProps?: Partial<AutocompleteProps<CalendarParty>>
): AutocompleteProps<CalendarParty> => {
  const { t } = useTranslation(['common', 'calendar']);

  const {
    value: searchValue,
    setValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });

  const { data: options, isLoading } = useCalendarSearch(debouncedSearchValue);

  return {
    label: t('calendar:inputLabels.participants'),
    optionIdKey: 'partyId',
    optionTextKey: 'text',
    placeholder: t('calendar:placeholders.participants'),
    multiple: true,
    open: searchValue.length > 0,
    filterSelectedOptions: true,
    filterOptions: (x) => x,
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
        caption: t(`common:searchType.${option.type}`),
      }),
    ...customProps,
  };
};
