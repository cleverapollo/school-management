import { Autocomplete, AutocompleteProps } from '@tyro/core';
import { PartyGroupType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

type GroupTypeAutocompleteProps = Omit<
  AutocompleteProps<PartyGroupType, false>,
  'options'
>;

const partyGroupOptions: PartyGroupType[] = [
  PartyGroupType.ClassGroup,
  PartyGroupType.CustomGroup,
  PartyGroupType.ProgrammeStage,
  PartyGroupType.SubjectGroup,
  PartyGroupType.YearGroup,
];

export const GroupTypeAutocomplete = (props: GroupTypeAutocompleteProps) => {
  const { t } = useTranslation(['groups', 'people']);

  return (
    <Autocomplete<PartyGroupType, false>
      label={t('people:groupTypes')}
      fullWidth
      multiple
      getOptionLabel={(option) => t(`groups:partyGroupType.${option}`)}
      options={partyGroupOptions}
      {...props}
    />
  );
};
