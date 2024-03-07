import { Box } from '@mui/material';
import { Avatar, AvatarProps as CoreAvatarProps } from '../../avatar';
import { RouterLink } from '../../router-link';

type TableAvatarProps = {
  to?: string | null;
  name: string;
  avatarUrl?: string | null | undefined;
  AvatarProps?: CoreAvatarProps;
  onBeforeNavigate?: () => void;
};

export function TableAvatar({
  to,
  name,
  avatarUrl,
  AvatarProps,
  onBeforeNavigate,
}: TableAvatarProps) {
  return (
    <Box display="flex" alignItems="center">
      <Avatar
        src={avatarUrl}
        name={name}
        {...AvatarProps}
        sx={{
          my: 1,
          mr: 1.5,
          ...(AvatarProps?.sx ?? {}),
        }}
      />
      {to ? (
        <RouterLink sx={{ fontWeight: 600 }} onClick={onBeforeNavigate} to={to}>
          {name}
        </RouterLink>
      ) : (
        <Box component="span">{name}</Box>
      )}
    </Box>
  );
}
