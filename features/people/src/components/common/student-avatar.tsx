import { Avatar, AvatarProps as CoreAvatarProps } from '@tyro/core';
import { IconButton } from '@mui/material';

interface StudentAvatarProps {
  name: string;
  src?: string | null | undefined;
  AvatarProps?: CoreAvatarProps;
}

export function StudentAvatar({ name, src, AvatarProps }: StudentAvatarProps) {
  return (
    <IconButton onClick={() => console.log('clicked avatar')}>
      <Avatar src={src} name={name} {...AvatarProps} />
    </IconButton>
  );
}
