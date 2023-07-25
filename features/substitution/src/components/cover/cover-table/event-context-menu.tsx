import { Menu, MenuItem, MenuProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ActionMenuIconWrapper } from '@tyro/core';
import { RoomSwapIcon, UserSwapIcon } from '@tyro/icons';

interface ResourceContextMenuProps extends MenuProps {
  onOpenReplaceTeacher: () => void;
  onOpenSwapRoom: () => void;
  isSelected: boolean;
}

export function EventCoverContextMenu({
  onOpenReplaceTeacher,
  onOpenSwapRoom,
  isSelected,
  ...props
}: ResourceContextMenuProps) {
  const { t } = useTranslation(['substitution']);

  const handleClose = () => {
    props.onClose?.({}, 'backdropClick');
  };

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
      <MenuItem
        onClick={(event) => {
          event.preventDefault();
          onOpenReplaceTeacher();
          handleClose();
        }}
      >
        <>
          <ActionMenuIconWrapper>
            <UserSwapIcon />
          </ActionMenuIconWrapper>
          {t('substitution:selectCoverTeacher')}
        </>
      </MenuItem>
      <MenuItem
        onClick={(event) => {
          event.preventDefault();
          onOpenSwapRoom();
          handleClose();
        }}
      >
        <>
          <ActionMenuIconWrapper>
            <RoomSwapIcon />
          </ActionMenuIconWrapper>
          {t('substitution:swapRoom')}
        </>
      </MenuItem>
    </Menu>
  );
}
