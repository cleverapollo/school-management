import { Path, FieldValues, Control } from 'react-hook-form';
import { useTranslation } from '@tyro/i18n';
import { RHFAutocomplete } from '@tyro/core';
import {
  usePersonalTitles,
  PersonalTitleOption,
} from '../../api/common/personal-titles';

type PersonalTitlesDropdownProps<TField extends FieldValues> = {
  name: Path<TField>;
  control: Control<TField>;
};

export const PersonalTitlesDropdown = <TField extends FieldValues>({
  name,
  control,
}: PersonalTitlesDropdownProps<TField>) => {
  const { t } = useTranslation(['people']);
  const { data: personalTitlesData = [] } = usePersonalTitles();

  return (
    <RHFAutocomplete<TField, PersonalTitleOption>
      label={t('people:title')}
      optionIdKey="id"
      optionTextKey="name"
      controlProps={{ name, control }}
      fullWidth
      options={personalTitlesData}
    />
  );
};
