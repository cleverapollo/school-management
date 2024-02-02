import { Box } from '@mui/material';
import {
  AvatarProps as CoreAvatarProps,
  RouterLink,
  RouterLinkProps,
  usePreferredNameLayout,
} from '@tyro/core';
import { Person } from '@tyro/api';
import { StudentAvatar } from './student-avatar';

type TableAvatarProps = {
  to?: string | null;
  person:
    | Pick<Person, 'avatarUrl' | 'firstName' | 'lastName' | 'partyId'>
    | undefined;
  isPriorityStudent?: boolean;
  hasSupportPlan?: boolean;
  AvatarProps?: CoreAvatarProps;
  avatarBackgroundColor?: string;
  size?: number;
  hideAvatar?: boolean;
  target?: RouterLinkProps['target'];
};

export function StudentTableAvatar({
  to,
  person,
  isPriorityStudent = false,
  hasSupportPlan = false,
  AvatarProps,
  avatarBackgroundColor,
  size,
  hideAvatar,
  target,
}: TableAvatarProps) {
  const { displayName } = usePreferredNameLayout();
  const name = displayName(person);

  return (
    <Box display="flex" alignItems="center">
      {hideAvatar ? null : (
        <StudentAvatar
          src={person?.avatarUrl}
          partyId={person?.partyId ?? 0}
          name={name}
          isPriorityStudent={isPriorityStudent}
          hasSupportPlan={hasSupportPlan}
          avatarBackgroundColor={avatarBackgroundColor}
          size={size}
          person={person}
          ContainingButtonProps={{
            sx: {
              my: 1,
              mr: 1.5,
            },
          }}
          AvatarProps={{ ...AvatarProps, person }}
        />
      )}
      {to ? (
        <RouterLink sx={{ fontWeight: 600 }} to={to} target={target}>
          {name}
        </RouterLink>
      ) : (
        <Box component="span">{name}</Box>
      )}
    </Box>
  );
}
