import { styled } from '@mui/material/styles';
import { Tooltip, IconButton, Stack } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { MailIcon, MailOpenIcon, TrashIcon } from '@tyro/icons';

const RootStyle = styled(Stack)(({ theme }) => ({
  height: 40,
  zIndex: 99,
  opacity: 0,
  margin: 'auto',
  position: 'absolute',
  alignItems: 'center',
  top: theme.spacing(1),
  right: theme.spacing(1),
  bottom: theme.spacing(1),
  justifyContent: 'center',
  padding: theme.spacing(0, 0.75),
  boxShadow: theme.customShadows.z12,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: theme.transitions.create('opacity'),
}));

type MailItemActionProps = {
  mailId: number;
  isRead?: boolean;
  className?: string;
};

export default function MailItemAction({
  mailId,
  isRead,
  className,
}: MailItemActionProps) {
  const { t } = useTranslation(['common', 'mail']);
  const MAIL_ACTIONS = useMemo(
    () => [
      {
        name: t('common:actions.delete'),
        icon: <TrashIcon />,
        action: () => console.log(`delete ${mailId}`),
      },
      {
        name: isRead
          ? t('mail:actions.markAsUnread')
          : t('mail:actions.markAsRead'),
        icon: isRead ? <MailIcon /> : <MailOpenIcon />,
        action: () => console.log(`mark as read ${mailId}`),
      },
    ],
    [t]
  );

  return (
    <RootStyle className={className} direction="row" spacing={0.75}>
      {MAIL_ACTIONS.map((action) => (
        <Tooltip key={action.name} title={action.name}>
          <IconButton
            size="small"
            onClick={action.action}
            sx={{
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            {action.icon}
          </IconButton>
        </Tooltip>
      ))}
    </RootStyle>
  );
}
