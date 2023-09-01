import { Menu, MenuItem, MenuProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ActionMenuIconWrapper } from '@tyro/core';
import { AddIcon } from '@tyro/icons';

interface ResourceContextMenuProps extends MenuProps {
  onOpenAddLessonDialog: () => void;
  isSelected: boolean;
}

export function TimetableContextMenu({
  onOpenAddLessonDialog,
  isSelected,
  ...props
}: ResourceContextMenuProps) {
  const { t } = useTranslation(['timetable']);
  const handleClose = () => {
    props.onClose?.({}, 'backdropClick');
  };

  return (
    <Menu
      {...props}
      onClose={handleClose}
      disableAutoFocusItem
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'bottom',
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
          onOpenAddLessonDialog();
          handleClose();
        }}
      >
        <ActionMenuIconWrapper>
          <AddIcon />
        </ActionMenuIconWrapper>
        {t('timetable:addLesson')}
      </MenuItem>
    </Menu>
  );
}
