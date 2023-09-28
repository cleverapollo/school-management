import { AutocompleteProps } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AutocompleteSearchType } from './index';

export const useSearchAutocompleteProps = <
  T extends AutocompleteSearchType
>(): Pick<
  AutocompleteProps<T>,
  | 'clearOnBlur'
  | 'optionIdKey'
  | 'getOptionLabel'
  | 'filterSelectedOptions'
  | 'filterOptions'
  | 'placeholder'
  | 'renderAvatarTags'
  | 'renderAvatarOption'
  | 'renderAvatarAdornment'
> => {
  const { t } = useTranslation(['common', 'attendance']);

  return {
    optionIdKey: 'partyId',
    filterSelectedOptions: true,
    placeholder: t('attendance:studentsClassGroupsEtc'),
    clearOnBlur: true,
    filterOptions: (x) => x,
    getOptionLabel: (option) => option?.text,
    renderAvatarTags: (option, renderTag) =>
      renderTag({
        name: option.text,
        src: option.avatarUrl ?? undefined,
      }),
    renderAvatarAdornment: (value, renderAdornment) =>
      renderAdornment({
        name: value?.text,
        src: value.avatarUrl,
      }),
    renderAvatarOption: (option, renderOption) =>
      renderOption({
        name: option.text,
        src: option.avatarUrl ?? undefined,
        caption: option.type ? t(`common:searchType.${option.type}`) : '',
      }),
  };
};
