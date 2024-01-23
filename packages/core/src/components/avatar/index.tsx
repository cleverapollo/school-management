import {
  Avatar as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material';
import { Person } from '@tyro/api';
import { forwardRef, useMemo } from 'react';
import { getColorBasedOnPerson, getColorBasedOnString } from '../../utils';

export interface AvatarProps extends Omit<MuiAvatarProps, 'src'> {
  name?: string;
  src?: string | null | undefined;
  size?: number;
  person?: Pick<Person, 'firstName' | 'lastName'> | null;
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
  ({ name, person, sx, children, src, size, ...props }, ref) => {
    const { initials, bgcolor } = useMemo(
      () => ({
        initials: getInitials(name),
        bgcolor: person
          ? getColorBasedOnPerson(person)
          : name && getColorBasedOnString(name),
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
