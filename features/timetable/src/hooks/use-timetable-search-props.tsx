import { AutocompleteProps, useDebouncedValue, Avatar } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  CalendarEventAttendeeType,
  getColorBasedOnIndex,
  Search,
} from '@tyro/api';
import { Chip } from '@mui/material';
import { useTimetableSearch } from '../api/timetable-search';

export type TimetableParty = Pick<Search, 'partyId' | 'text' | 'avatarUrl'> & {
  type?: Search['type'];
  attendeeType?: CalendarEventAttendeeType;
};

export const useTimetableSearchProps = (
  customProps?: Partial<AutocompleteProps<TimetableParty, true>>
): AutocompleteProps<TimetableParty, true> => {
  const { t } = useTranslation(['common', 'calendar']);

  const {
    value: searchValue,
    setValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });

  const { data: options, isLoading } = useTimetableSearch(debouncedSearchValue);

  return {
    label: t('calendar:inputLabels.participants'),
    optionIdKey: 'partyId',
    optionTextKey: 'text',
    placeholder: t('calendar:placeholders.participants'),
    multiple: true,
    open: searchValue.length > 0,
    filterSelectedOptions: true,
    clearOnBlur: true,
    filterOptions: (x) => x,
    freeSolo: true,
    loading: isLoading,
    options: options ?? [],
    onInputChange: (_, newInputValue) => setSearchValue(newInputValue),
    renderTags: (tags, getTagProps) =>
      tags.map((tag, index) => (
        <Chip
          size="small"
          variant="soft"
          color={getColorBasedOnIndex(index)}
          avatar={<Avatar name={tag.text} src={tag.avatarUrl ?? undefined} />}
          label={tag.text}
          {...getTagProps({ index })}
        />
      )),
    renderAvatarOption: (option, renderOption) =>
      renderOption({
        name: option.text,
        src: option.avatarUrl ?? undefined,
        caption: option.type ? t(`common:searchType.${option.type}`) : '',
      }),
    ...customProps,
  };
};
