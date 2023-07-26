import { Menu, MenuItem, MenuProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ActionMenuIconWrapper } from '@tyro/core';
import { UserSwapIcon } from '@tyro/icons';

interface ResourceContextMenuProps extends MenuProps {
  applyCover: () => void;
  isSelected: boolean;
}

export function EventCoverContextMenu({
  applyCover,
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
          applyCover();
          handleClose();
        }}
      >
        <>
          <ActionMenuIconWrapper>
            <UserSwapIcon />
          </ActionMenuIconWrapper>
          {t('substitution:applyCover')}
        </>
      </MenuItem>
    </Menu>
  );
}
