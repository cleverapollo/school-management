import {
  Menu,
  MenuItem,
  MenuProps,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Card,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  ActionMenuIconWrapper,
  DialogTitle,
  useBreakpointValue,
} from '@tyro/core';
import { EditIcon, UndoIcon, UserSwapIcon } from '@tyro/icons';
import { CoverEvent } from '../../../hooks/use-cover-table';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { CoverCardTooltipContent } from './cover-card-tooltip';

interface ResourceContextMenuProps extends MenuProps {
  applyCover: () => void;
  editCover: () => void;
  removeCover: () => void;
  isSelected: boolean;
  showApply: boolean;
  showEdit: boolean;
  showRemove: boolean;
  eventInfo: CoverEvent;
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
}

export function EventCoverContextMenu({
  applyCover,
  editCover,
  removeCover,
  isSelected,
  showApply,
  showEdit,
  showRemove,
  eventInfo,
  staff,
  ...props
}: ResourceContextMenuProps) {
  const { customShadows, palette } = useTheme();
  const { t } = useTranslation(['common', 'substitution']);
  const isMobile = useBreakpointValue(
    { base: false, sm: true },
    { type: 'down' }
  );

  const handleClose = () => {
    props.onClose?.({}, 'backdropClick');
  };

  const handleApply = (
    event: React.MouseEvent<HTMLLIElement | HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    applyCover();
    handleClose();
  };

  const handleEdit = (
    event: React.MouseEvent<HTMLLIElement | HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    editCover();
    handleClose();
  };

  const handleRemove = (
    event: React.MouseEvent<HTMLLIElement | HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    removeCover();
    handleClose();
  };

  const availableActions = [
    {
      show: showApply,
      handler: handleApply,
      icon: UserSwapIcon,
      text: t('substitution:applyCover'),
    },
    {
      show: showEdit,
      handler: handleEdit,
      icon: EditIcon,
      text: t('substitution:editCover'),
    },
    {
      show: showRemove,
      handler: handleRemove,
      icon: UndoIcon,
      text: t('substitution:removeCover'),
    },
  ] as const;

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={props.open}
        onClose={handleClose}
        sx={{
          '& > .MuiDrawer-paper': {
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          },
        }}
      >
        <DialogTitle onClose={handleClose}>{t('common:details')}</DialogTitle>
        <Box px={3}>
          <Card sx={{ px: 1 }}>
            <CoverCardTooltipContent eventInfo={eventInfo} staff={staff} />
          </Card>
        </Box>
        <Typography variant="h6" sx={{ px: 3, pt: 2 }}>
          {t('substitution:actions')}
        </Typography>
        <List sx={{ pb: 8, px: 1 }}>
          {availableActions
            .filter(({ show }) => show)
            .map(({ handler, icon: Icon, text }) => (
              <ListItem
                key={text}
                sx={{
                  py: 0.5,
                  px: 2,
                }}
              >
                <ListItemButton
                  component="button"
                  onClick={handler}
                  color="primary"
                  sx={{
                    border: '1px solid',
                    borderColor: 'indigo.50',
                    boxShadow: customShadows.card,
                    borderRadius: 1,
                    '.MuiTouchRipple-child': {
                      'background-color': palette.primary.main,
                    },
                  }}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
    );
  }

  return (
    <Menu
      {...props}
      onClose={handleClose}
      disableAutoFocusItem
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        ml: 1,
        '& li': {
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',

          '& > div': {
            display: 'flex',
            alignItems: 'center',
            mr: 1,
          },
        },
      }}
    >
      {availableActions
        .filter(({ show }) => show)
        .map(({ handler, icon: Icon, text }) => (
          <MenuItem onClick={handler}>
            <>
              <ActionMenuIconWrapper>
                <Icon />
              </ActionMenuIconWrapper>
              {text}
            </>
          </MenuItem>
        ))}
    </Menu>
  );
}
