import { Grid } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Control,
  UseFormSetFocus,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { RHFAutocomplete } from '@tyro/core';
import { useCallback } from 'react';
import { MemberType } from '@tyro/api';
import { ListPeoplePagination, usePeopleAutocompleteProps } from '@tyro/people';
import {
  MemberOption,
  useMembersByPermissionType,
} from '../../../hooks/use-members-by-permission-type';
import { PermissionFormState } from './types';

type AssignMembersProps = {
  memberType: MemberType;
  control: Control<PermissionFormState>;
  setFocus: UseFormSetFocus<PermissionFormState>;
  setValue: UseFormSetValue<PermissionFormState>;
};

export const AssignMembers = ({
  memberType,
  setValue,
  setFocus,
  control,
}: AssignMembersProps) => {
  const { t } = useTranslation(['settings', 'common']);

  const { getMembersByMemberType } = useMembersByPermissionType();
  const peopleAutocompleteProps = usePeopleAutocompleteProps<MemberOption>();

  const members = useWatch({ control, name: 'members' });

  const removeMember = useCallback(
    (currentPartyId: MemberOption['partyId']) => {
      setValue(
        'members',
        members.filter(({ partyId }) => currentPartyId !== partyId)
      );
    },
    [setValue, members]
  );

  const options = getMembersByMemberType(memberType);

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <RHFAutocomplete<PermissionFormState, MemberOption>
          {...peopleAutocompleteProps}
          fullWidth
          multiple
          unshiftMode
          filterSelectedOptions
          label={t(`common:searchByMemberType.${memberType}`)}
          options={options}
          renderAvatarTags={() => null}
          controlProps={{
            control,
            name: 'members',
          }}
        />
      </Grid>
      <ListPeoplePagination
        people={members}
        emptyTitle={t('settings:permissions.emptyMembers')}
        emptyDescription={t('settings:permissions.emptyMembersCta')}
        noFoundMessage={t('settings:permissions.noMembersFound')}
        removeLabel={t('settings:permissions.removeMember')}
        onFocus={() => setFocus('members')}
        onRemove={removeMember}
      />
    </Grid>
  );
};
