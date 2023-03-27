import { Box } from '@mui/material';
import { Avatar } from '../avatar';
import { RouterLink } from '../router-link';

type TableAvatarProps = {
  avatarUrl: string | null | undefined;
  name: string;
  to: string;
};

export function TableAvatar({ avatarUrl, name, to }: TableAvatarProps) {
  return (
    <Box display="flex" alignItems="center">
      <Avatar
        src={avatarUrl ?? undefined}
        name={name}
        sx={{
          my: 1,
          mr: 1.5,
        }}
      />
      <RouterLink sx={{ fontWeight: 600 }} to={to}>
        {name}
      </RouterLink>
    </Box>
  );
}
