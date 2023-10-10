import { Box } from '@mui/material';
import {
  AvatarProps as CoreAvatarProps,
  RouterLink,
  usePreferredNameLayout,
} from '@tyro/core';
import { Person } from '@tyro/api';
import { StudentAvatar } from './student-avatar';

type TableAvatarProps = {
  to?: string | null;
  person:
    | Pick<Person, 'avatarUrl' | 'firstName' | 'lastName' | 'partyId'>
    | undefined;
  isPriorityStudent: boolean;
  hasSupportPlan: boolean;
  AvatarProps?: CoreAvatarProps;
  avatarBackgroundColor?: string;
  size?: number;
};

export function StudentTableAvatar({
  to,
  person,
  isPriorityStudent,
  hasSupportPlan,
  AvatarProps,
  avatarBackgroundColor,
  size,
}: TableAvatarProps) {
  const { displayName } = usePreferredNameLayout();
  const name = displayName(person);

  return (
    <Box display="flex" alignItems="center">
      <StudentAvatar
        src={person?.avatarUrl}
        partyId={person?.partyId ?? 0}
        name={name}
        isPriorityStudent={isPriorityStudent}
        hasSupportPlan={hasSupportPlan}
        avatarBackgroundColor={avatarBackgroundColor}
        size={size}
        ContainingButtonProps={{
          sx: {
            my: 1,
            mr: 1.5,
          },
        }}
        AvatarProps={AvatarProps}
      />
      {to ? (
        <RouterLink sx={{ fontWeight: 600 }} to={to}>
          {name}
        </RouterLink>
      ) : (
        <Box component="span">{name}</Box>
      )}
    </Box>
  );
}
