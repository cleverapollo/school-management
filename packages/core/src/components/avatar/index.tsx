import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material';
import { forwardRef, useMemo } from 'react';
import { getColorBasedOnString } from '../../utils';

export interface AvatarProps extends Omit<MuiAvatarProps, 'src'> {
  name?: string;
  src?: string | null | undefined;
  size?: number;
}

function getInitials(name: string | undefined) {
  if (!name) return null;
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, sx, children, src, size, ...props }, ref) => {
    const { initials, bgcolor } = useMemo(
      () => ({
        initials: getInitials(name),
        bgcolor: name ? getColorBasedOnString(name) : undefined,
      }),
      [name]
    );

    return (
      <MuiAvatar
        ref={ref}
        sx={{
          bgcolor,
          width: size,
          height: size,
          fontSize: size ? Math.ceil(size * 0.35) : undefined,
          ...sx,
        }}
        alt={name}
        src={src ?? undefined}
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
