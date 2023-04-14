import { Box } from '@mui/material';
import { Person } from '@tyro/api';
import { usePreferredNameLayout } from '../../hooks';
import { Avatar } from '../avatar';
import { RouterLink } from '../router-link';

type TableAvatarProps = {
  to?: string | null;
  person: Partial<Person> | undefined;
};

export function TableAvatar({ to, person }: TableAvatarProps) {
  const { displayName } = usePreferredNameLayout();
  const name = displayName(person);

  return (
    <Box display="flex" alignItems="center">
      <Avatar
        src={person?.avatarUrl ?? undefined}
        name={name}
        sx={{
          my: 1,
          mr: 1.5,
        }}
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
