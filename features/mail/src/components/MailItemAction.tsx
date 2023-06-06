/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import { styled } from '@mui/material/styles';
import { Tooltip, IconButton } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import {
  ArchiveAltIcon,
  EyeSlashIcon,
  MailCheckmarkIcon,
  TrashIcon,
} from '@tyro/icons';

// ----------------------------------------------------------------------

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

// ----------------------------------------------------------------------

type Props = {
  handleArchive?: VoidFunction;
  handleDelete?: VoidFunction;
  handleMarkRead?: VoidFunction;
  handleHidden?: VoidFunction;
  className?: string;
};

export default function MailItemAction({
  handleArchive,
  handleDelete,
  handleMarkRead,
  handleHidden,
  ...other
}: Props) {
  const { t } = useTranslation(['common']);
  const MAIL_ACTIONS = useMemo(
    () => [
      {
        name: t('common:actions.archive'),
        icon: <ArchiveAltIcon />,
        action: handleArchive,
      },
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
      {
        name: t('common:actions.hideEmail'),
        icon: <EyeSlashIcon />,
        action: handleHidden,
      },
    ],
    [t]
  );

  return (
    <RootStyle {...other}>
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
