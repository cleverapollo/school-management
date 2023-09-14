import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Tooltip,
  Typography,
  Box,
  Link,
  Stack,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  Control,
  UseFormSetFocus,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import {
  Avatar,
  PlaceholderCard,
  RHFAutocomplete,
  SearchInput,
  usePaginationList,
  usePreferredNameLayout,
} from '@tyro/core';
import { useCallback, useMemo, useState } from 'react';
import { TrashIcon } from '@tyro/icons';
import { MemberType } from '@tyro/api';
import { usePeopleAutocompleteProps } from '@tyro/people';
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
  const { displayName, searchDisplayName } = usePreferredNameLayout();

  const [searchMember, setSearchMember] = useState('');

  const { getMembersByMemberType } = useMembersByPermissionType();
  const peopleAutocompleteProps = usePeopleAutocompleteProps<MemberOption>();

  const members = useWatch({ control, name: 'members' });

  const filteredMembers = useMemo(
    () => searchDisplayName(members, searchMember),
    [members, searchMember]
  );

  const removeMember = useCallback(
    (currentPartyId: MemberOption['partyId']) => {
      setValue(
        'members',
        members.filter(({ partyId }) => currentPartyId !== partyId)
      );
    },
    [setValue, members]
  );

  const focusOnAutocomplete = () => {
    setFocus('members');
  };

  const { currentList, paginationCount, currentPage, setCurrentPage } =
    usePaginationList<MemberOption[]>({
      initialList: members,
      filteredList: filteredMembers,
    });

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
      {members.length > 1 && (
        <Grid item xs={12}>
          <SearchInput
            value={searchMember}
            onChange={(e) => setSearchMember(e.target.value)}
            size="medium"
          />
        </Grid>
      )}
      <Grid item xs={12}>
        {members.length === 0 && (
          <PlaceholderCard cardProps={{ sx: { boxShadow: 'none', p: 0 } }}>
            <Box>
              <Typography component="h4" variant="subtitle1">
                {t('settings:permissions.emptyMembers')}
              </Typography>
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={focusOnAutocomplete}
              >
                {t('settings:permissions.emptyMembersCta')}
              </Link>
            </Box>
          </PlaceholderCard>
        )}
        {filteredMembers.length === 0 && searchMember.length > 0 && (
          <PlaceholderCard
            cardProps={{
              sx: { boxShadow: 'none', p: 0 },
            }}
          >
            <Stack direction="column">
              <Typography component="h4" variant="body1" color="primary">
                {t('settings:permissions.noMembersFound')}
              </Typography>
              <img
                alt=""
                src="/assets/illustrations/illustration-user-cloud.svg"
              />
            </Stack>
          </PlaceholderCard>
        )}
        {filteredMembers.length > 0 && (
          <List sx={{ width: '100%' }}>
            {currentList.map((member) => (
              <ListItem
                key={member.partyId}
                secondaryAction={
                  <Tooltip title={t('settings:permissions.removeMember')}>
                    <IconButton
                      color="primary"
                      onClick={() => removeMember(member.partyId)}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemAvatar>
                  <Avatar src={member.avatarUrl} name={displayName(member)} />
                </ListItemAvatar>
                <ListItemText
                  primary={displayName(member)}
                  secondary={member.caption}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Grid>
      {paginationCount > 1 && (
        <Grid item xs={12}>
          <Pagination
            page={currentPage}
            onChange={(_e, p) => setCurrentPage(p)}
            count={paginationCount}
          />
        </Grid>
      )}
    </Grid>
  );
};
