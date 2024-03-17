import { Box } from '@mui/material';
import { Avatar, AvatarProps as CoreAvatarProps } from '../../avatar';
import { RouterLink, RouterLinkProps } from '../../router-link';

export type TableAvatarProps = {
  to?: string | null;
  name: string;
  avatarUrl?: string | null | undefined;
  AvatarProps?: CoreAvatarProps;
  onBeforeNavigate?: () => void;
  hideAvatar?: boolean;
  target?: RouterLinkProps['target'];
};

export function TableAvatar({
  to,
  name,
  avatarUrl,
  AvatarProps,
  onBeforeNavigate,
  hideAvatar,
  target,
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
        <RouterLink
          sx={{ fontWeight: 600 }}
          to={to}
          target={target}
          onClick={onBeforeNavigate}
        >
          {name}
        </RouterLink>
      ) : (
        <Box component="span">{name}</Box>
      )}
    </Box>
  );
}
