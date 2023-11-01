import { Menu, MenuItem, MenuProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ActionMenuIconWrapper } from '@tyro/core';
import { EditIcon, UndoIcon, UserSwapIcon } from '@tyro/icons';

interface ResourceContextMenuProps extends MenuProps {
  applyCover: () => void;
  editCover: () => void;
  removeCover: () => void;
  isSelected: boolean;
  showApply: boolean;
  showEdit: boolean;
  showRemove: boolean;
}

export function EventCoverContextMenu({
  applyCover,
  editCover,
  removeCover,
  isSelected,
  showApply,
  showEdit,
  showRemove,
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
      {showApply && (
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
      )}
      {showEdit && (
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            editCover();
            handleClose();
          }}
        >
          <>
            <ActionMenuIconWrapper>
              <EditIcon />
            </ActionMenuIconWrapper>
            {t('substitution:editCover')}
          </>
        </MenuItem>
      )}
      {showRemove && (
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            removeCover();
            handleClose();
          }}
        >
          <>
            <ActionMenuIconWrapper>
              <UndoIcon />
            </ActionMenuIconWrapper>
            {t('substitution:removeCover')}
          </>
        </MenuItem>
      )}
    </Menu>
  );
}
