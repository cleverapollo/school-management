import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Tooltip,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { Control } from 'react-hook-form';
import {
  Avatar,
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
  control: TField extends AssignMembersFormState ? Control<TField> : never;
};

const ROWS_PER_PAGE = 5;

export const AssignMembers = <TField extends AssignMembersFormState>({
  memberType,
  control,
}: AssignMembersProps<TField>) => {
  const { t } = useTranslation(['settings']);
  const { displayName } = usePreferredNameLayout();

  const membersByPermission = useMembersByPermissionType(memberType);

  const [members, setMembers] = useState<MemberOption[]>([]);
  const [searchMember, setSearchMember] = useState('');

  const [page, setPage] = useState(1);
  const [autocompleteValue, setAutocompleteValue] = useState('');

  const unassignedMembers = useMemo(() => {
    const ids = members.map(({ partyId }) => partyId);

    return membersByPermission.filter(
      (member) => !ids.includes(member.partyId)
    );
  }, [members, membersByPermission]);

  const filteredMembers = useMemo(
    () =>
      members.filter((member) =>
        displayName(member).toLowerCase().includes(searchMember.toLowerCase())
      ),
    [members, page, searchMember, displayName]
  );

  const removeMember = useCallback(
    (currentPartyId: MemberOption['partyId']) => {
      setMembers(members.filter(({ partyId }) => currentPartyId !== partyId));
    },
    [setMembers, members]
  );

  const paginationCount = Math.ceil(filteredMembers.length / ROWS_PER_PAGE);

  return (
    <Grid container gap={3}>
      <Grid item xs={12}>
        <RHFAutocomplete<AssignMembersFormState, MemberOption, true>
          fullWidth
          freeSolo
          value={autocompleteValue}
          inputValue={autocompleteValue}
          label={t(`settings:permissions.searchByMemberType.${memberType}`)}
          options={unassignedMembers}
          optionIdKey="partyId"
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : displayName(option)
          }
          onInputChange={(_, v) => setAutocompleteValue(v)}
          onChange={(_ev, member) => {
            if (typeof member !== 'string' && member) {
              setMembers([member as MemberOption, ...members]);
              setAutocompleteValue('');
            }
          }}
          renderAvatarTags={(option, renderTag) =>
            renderTag({
              name: displayName(option),
              src: option.avatarUrl,
            })
          }
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
      {filteredMembers.length > 0 && (
        <Grid item xs={12}>
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
        </Grid>
      )}
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
