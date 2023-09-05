import { styled } from '@mui/material/styles';
import { Tooltip, IconButton } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { MailCheckmarkIcon, TrashIcon } from '@tyro/icons';

const RootStyle = styled('div')(({ theme }) => ({
  height: 40,
  zIndex: 99,
  opacity: 0,
  margin: 'auto',
  display: 'flex',
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

type Props = {
  handleDelete?: VoidFunction;
  handleMarkRead?: VoidFunction;
};

export default function MailItemAction({
  handleDelete,
  handleMarkRead,
}: Props) {
  const { t } = useTranslation(['common']);
  const MAIL_ACTIONS = useMemo(
    () => [
      {
        name: t('common:actions.delete'),
        icon: <TrashIcon />,
        action: handleDelete,
      },
      {
        name: t('common:actions.markEmail'),
        icon: <MailCheckmarkIcon />,
        action: handleMarkRead,
      },
    ],
    [t]
  );

  return (
    <RootStyle>
      {MAIL_ACTIONS.map((action) => (
        <Tooltip key={action.name} title={action.name}>
          <IconButton
            size="small"
            onClick={action.action}
            sx={{
              mx: 0.75,
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
