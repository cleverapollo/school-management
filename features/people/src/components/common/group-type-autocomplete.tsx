import { Autocomplete, AutocompleteProps } from '@tyro/core';
import { PartyGroupType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';

type GroupTypeAutocompleteProps = Omit<
  AutocompleteProps<PartyGroupType, true>,
  'options'
>;

const partyGroupOptions: PartyGroupType[] = [
  PartyGroupType.ClassGroup,
  PartyGroupType.CustomGroup,
  PartyGroupType.GeneralGroup,
  PartyGroupType.ProgrammeStage,
  PartyGroupType.SubjectGroup,
  PartyGroupType.SupportGroup,
  PartyGroupType.YearGroup,
];

export const GroupTypeAutocomplete = (props: GroupTypeAutocompleteProps) => {
  const { t } = useTranslation(['people']);

  return (
    <Autocomplete<PartyGroupType, true>
      label={t('people:groupType')}
      fullWidth
      multiple
      getOptionLabel={(option) =>
        option.replace('_', ' ').charAt(0).toUpperCase() +
        option.replace('_', ' ').slice(1).toLowerCase()
      }
      options={partyGroupOptions}
      {...props}
    />
  );
};
