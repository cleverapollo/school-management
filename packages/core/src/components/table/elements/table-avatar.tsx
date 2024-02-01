import { Box } from '@mui/material';
import { Avatar, AvatarProps as CoreAvatarProps } from '../../avatar';
import { RouterLink } from '../../router-link';

type TableAvatarProps = {
  to?: string | null;
  name: string;
  avatarUrl?: string | null | undefined;
  AvatarProps?: CoreAvatarProps;
  hideAvatar?: boolean;
};

export function TableAvatar({
  to,
  name,
  avatarUrl,
  AvatarProps,
  hideAvatar,
}: TableAvatarProps) {
  return (
    <Box display="flex" alignItems="center">
      {hideAvatar ? null : (
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
      )}
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
