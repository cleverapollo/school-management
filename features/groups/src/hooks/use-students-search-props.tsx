import { AutocompleteProps, useDebouncedValue, Avatar } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { getColorBasedOnIndex, Search } from '@tyro/api';
import { Chip } from '@mui/material';
import { useStudentsSearch } from '../api/students-search';

export type StudentsSearchParty = Pick<
  Search,
  'partyId' | 'text' | 'avatarUrl'
> & {
  type?: Search['type'];
};

export const useStudentsSearchProps = (
  customProps?: Partial<AutocompleteProps<StudentsSearchParty, true>>
): AutocompleteProps<StudentsSearchParty, true> => {
  const { t } = useTranslation(['common', 'calendar']);

  const {
    value: searchValue,
    setValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });

  const { data: options, isLoading } = useStudentsSearch(debouncedSearchValue);

  return {
    label: t('common:searchByMemberType.STUDENT_GROUPS'),
    optionIdKey: 'partyId',
    optionTextKey: 'text',
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
