/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { AvatarGroup, Stack } from '@mui/material';
import { Avatar } from '@tyro/core';
import { Person } from '@tyro/api';
import { displayName } from '../../../../src/utils/nameUtils';

export interface MultiPersonsAvatarsProps {
  person: Person | [Person] | undefined;
}

export function MultiPersonsAvatars({ person }: MultiPersonsAvatarsProps) {
  if (person == null || (Array.isArray(person) && !person.length)) {
    return (
      <Stack direction="row" spacing={2}>
        <span>-</span>
      </Stack>
    );
  }

  if (Array.isArray(person)) {
    return (
      <Stack direction="row" spacing={1} alignItems="center">
        <AvatarGroup max={1} spacing={10}>
          {person?.map((p) => (
            <Avatar name={displayName(p)} src={p.avatarUrl || ''} />
          ))}
        </AvatarGroup>
        <span>{displayName(person[0])}</span>
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar />
      <span>{displayName(person)}</span>
    </Stack>
  );
}
