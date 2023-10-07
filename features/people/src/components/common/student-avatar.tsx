import {
  Avatar,
  AvatarProps as CoreAvatarProps,
  useDisclosure,
} from '@tyro/core';
import {
  Badge,
  Box,
  IconButton,
  IconButtonProps,
  styled,
  useTheme,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';

interface StudentAvatarProps {
  partyId: number;
  name: string;
  src?: string | null | undefined;
  isPriorityStudent: boolean;
  hasSupportPlan: boolean;
  AvatarProps?: CoreAvatarProps;
  ContainingButtonProps?: IconButtonProps;
  avatarBackgroundColor?: string;
  size?: number;
}

const CenterBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '50%',
}));

export function StudentAvatar({
  name,
  src,
  isPriorityStudent,
  hasSupportPlan,
  AvatarProps,
  ContainingButtonProps,
  avatarBackgroundColor,
  size = 40,
}: StudentAvatarProps) {
  const { t } = useTranslation(['common', 'people']);
  const { getButtonProps, getDisclosureProps } = useDisclosure();
  const { palette } = useTheme();

  return (
    <IconButton
      disabled={!isPriorityStudent && !hasSupportPlan}
      aria-label={t('people:studentClickableAvatarAria', { name })}
      {...ContainingButtonProps}
      sx={{
        ...(ContainingButtonProps?.sx ?? {}),
        padding: 0,
        '&:hover': {
          boxShadow: '0px 0px 0px 8px rgba(71, 85, 105, 0.08)',
          backgroundColor: 'transparent',
        },
      }}
      {...getButtonProps()}
    >
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
    </IconButton>
  );
}
