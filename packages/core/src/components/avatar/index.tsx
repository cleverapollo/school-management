import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material';
import { forwardRef, useMemo } from 'react';

export interface AvatarProps extends MuiAvatarProps {
  name?: string;
}

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function getInitials(name: string | undefined) {
  if (!name) return null;
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, sx, children, ...props }, ref) => {
    const { initials, bgcolor } = useMemo(
      () => ({
        initials: getInitials(name),
        bgcolor: name ? stringToColor(name) : undefined,
      }),
      [name]
    );

    return (
      <MuiAvatar
        ref={ref}
        sx={{
          bgcolor,
          ...sx,
        }}
        alt={name}
        {...props}
      >
        {initials}
        {children}
      </MuiAvatar>
    );
  }
);

if (process.env.NODE_ENV !== 'production') {
  Avatar.displayName = 'Avatar';
}
