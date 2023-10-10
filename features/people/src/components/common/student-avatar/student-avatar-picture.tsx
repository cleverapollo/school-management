import { Badge, Box, IconButtonProps, styled, useTheme } from '@mui/material';
import { Avatar, AvatarProps as CoreAvatarProps } from '@tyro/core';

const CenterBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
}));

export interface StudentAvatarPictureProps {
  name: string;
  src?: string | null | undefined;
  isPriorityStudent: boolean;
  hasSupportPlan: boolean;
  AvatarProps?: CoreAvatarProps;
  avatarBackgroundColor?: string;
  size?: number;
}

export function StudentAvatarPicture({
  name,
  src,
  isPriorityStudent,
  hasSupportPlan,
  AvatarProps,
  avatarBackgroundColor,
  size = 40,
}: StudentAvatarPictureProps) {
  const { palette } = useTheme();

  return (
    <Badge
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{
        '& .MuiBadge-badge': {
          boxShadow: `0 0 0 2px ${
            avatarBackgroundColor ?? palette.background.paper
          }`,
          backgroundColor: palette.blue[500],
          transform: 'scale(1) translate(40%, -40%)',
        },
      }}
      overlap="circular"
      variant="dot"
      badgeContent={hasSupportPlan ? 1 : 0}
    >
      <CenterBox
        sx={{
          ...(isPriorityStudent && {
            background: `linear-gradient(${palette.indigo[400]}, ${palette.indigo[600]})`,
          }),
          overflow: 'hidden',
          width: size,
          height: size,
        }}
      >
        <CenterBox
          sx={{
            ...(isPriorityStudent && {
              backgroundColor:
                avatarBackgroundColor ?? palette.background.paper,
            }),
            width: isPriorityStudent ? size - 4 : size,
            height: isPriorityStudent ? size - 4 : size,
          }}
        >
          <Avatar
            name={name}
            src={src}
            size={isPriorityStudent ? size - 8 : size}
            {...AvatarProps}
            sx={{
              fontSize: size ? Math.ceil(size * 0.35) : undefined,
            }}
          />
        </CenterBox>
      </CenterBox>
    </Badge>
  );
}
