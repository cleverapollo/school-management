import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material';
import { forwardRef, useMemo } from 'react';

export interface AvatarProps extends MuiAvatarProps {
  name?: string;
}

const availableAvatarColors = [
  'red.500',
  'red.600',
  'red.700',
  'red.800',
  'orange.500',
  'orange.600',
  'orange.700',
  'orange.800',
  'amber.500',
  'amber.600',
  'amber.700',
  'amber.800',
  'yellow.500',
  'yellow.600',
  'yellow.700',
  'yellow.800',
  'lime.500',
  'lime.600',
  'lime.700',
  'lime.800',
  'green.500',
  'green.600',
  'green.700',
  'green.800',
  'emerald.500',
  'emerald.600',
  'emerald.700',
  'emerald.800',
  'teal.500',
  'teal.600',
  'teal.700',
  'teal.800',
  'cyan.500',
  'cyan.600',
  'cyan.700',
  'cyan.800',
  'sky.500',
  'sky.600',
  'sky.700',
  'sky.800',
  'blue.500',
  'blue.600',
  'blue.700',
  'blue.800',
  'indigo.500',
  'indigo.600',
  'indigo.700',
  'indigo.800',
  'violet.500',
  'violet.600',
  'violet.700',
  'violet.800',
  'purple.500',
  'purple.600',
  'purple.700',
  'purple.800',
  'fuchsia.500',
  'fuchsia.600',
  'fuchsia.700',
  'fuchsia.800',
  'pink.500',
  'pink.600',
  'pink.700',
  'pink.800',
  'rose.500',
  'rose.600',
  'rose.700',
  'rose.800',
];

function stringToColor(string: string) {
  const hashString = string
    .split('')
    .map((char) => char.charCodeAt(0))
    .reduce((a, b) => a + b, 0);

  return availableAvatarColors[hashString % availableAvatarColors.length];
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
