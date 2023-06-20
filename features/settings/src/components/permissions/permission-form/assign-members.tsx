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
import { Control, UseFormSetFocus, UseFormSetValue } from 'react-hook-form';
import {
  Avatar,
  PlaceholderCard,
  RHFAutocomplete,
  SearchInput,
  usePreferredNameLayout,
} from '@tyro/core';
import { useCallback, useMemo, useState } from 'react';
import { TrashIcon } from '@tyro/icons';
import { MemberType } from '@tyro/api';
import {
  MemberOption,
  useMembersByPermissionType,
} from '../../../hooks/use-members-by-permission-type';

export type AssignMembersFormState = {
  members: MemberOption[];
};

type AssignMembersProps<TField extends AssignMembersFormState> = {
  memberType: MemberType;
  members: MemberOption[];
  control: TField extends AssignMembersFormState ? Control<TField> : never;
  setFocus: TField extends AssignMembersFormState
    ? UseFormSetFocus<TField>
    : never;
  setValue: TField extends AssignMembersFormState
    ? UseFormSetValue<TField>
    : never;
};

const ROWS_PER_PAGE = 5;

export const AssignMembers = <TField extends AssignMembersFormState>({
  memberType,
  members,
  setValue,
  setFocus,
  control,
}: AssignMembersProps<TField>) => {
  const { t } = useTranslation(['settings']);
  const { displayName } = usePreferredNameLayout();

  const [searchMember, setSearchMember] = useState('');
  const [page, setPage] = useState(1);

  const membersByPermission = useMembersByPermissionType(memberType);

  const filteredMembers = useMemo(
    () =>
      members
        .filter((member) =>
          displayName(member).toLowerCase().includes(searchMember.toLowerCase())
        )
        .reverse(),
    [members, page, searchMember, displayName]
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

  const paginationCount = Math.ceil(filteredMembers.length / ROWS_PER_PAGE);

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <RHFAutocomplete<AssignMembersFormState, MemberOption>
          fullWidth
          multiple
          openOnFocus
          filterSelectedOptions
          label={t(`settings:permissions.searchByMemberType.${memberType}`)}
          options={membersByPermission}
          optionIdKey="partyId"
          getOptionLabel={(option) => displayName(option)}
          renderTags={() => null}
          renderAvatarOption={(option, renderOption) =>
            renderOption({
              name: displayName(option),
              src: option.avatarUrl,
            })
          }
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
            {filteredMembers
              .slice(
                (page - 1) * ROWS_PER_PAGE,
                (page - 1) * ROWS_PER_PAGE + ROWS_PER_PAGE
              )
              .map((member) => (
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
                  <ListItemText primary={displayName(member)} />
                </ListItem>
              ))}
          </List>
        )}
      </Grid>
      {paginationCount > 1 && (
        <Grid item xs={12}>
          <Pagination
            page={page}
            onChange={(_e, p) => setPage(p)}
            count={paginationCount}
          />
        </Grid>
      )}
    </Grid>
  );
};
