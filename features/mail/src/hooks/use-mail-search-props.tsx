import { AutocompleteProps, useDebouncedValue } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeUseMailSearch, useMailSearch } from '../api/mail-search';

export const useMailSearchProps = (
  customProps?: Partial<AutocompleteProps<ReturnTypeUseMailSearch, true>>
): AutocompleteProps<ReturnTypeUseMailSearch, true> => {
  const { t } = useTranslation(['common']);
  const {
    value: searchValue,
    setValue: setSearchValue,
    debouncedValue: debouncedSearchValue,
  } = useDebouncedValue({
    defaultValue: '',
  });

  const { data: options = [], isLoading } = useMailSearch(debouncedSearchValue);

  return {
    optionTextKey: 'text',
    multiple: true,
    open: searchValue.length > 0,
    filterSelectedOptions: true,
    clearOnBlur: true,
    filterOptions: (x) => x,
    freeSolo: true,
    loading: isLoading,
    options,
    limitTags: 2,
    inputValue: searchValue,
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
