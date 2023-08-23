import { Divider, Menu, MenuItem, MenuProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ActionMenuIconWrapper } from '@tyro/core';
import { AddIcon, BuildingGraduateHatIcon, TrashIcon } from '@tyro/icons';

interface ResourceContextMenuProps extends MenuProps {
  selectedLessonIds: string[];
  onOpenSwapTeacherOrRoomDialog: () => void;
  onOpenDeleteLessonDialog: () => void;
  onOpenAddLessonDialog: () => void;
  isSelected: boolean;
}

export function LessonContextMenu({
  selectedLessonIds,
  onOpenSwapTeacherOrRoomDialog,
  onOpenDeleteLessonDialog,
  onOpenAddLessonDialog,
  isSelected,
  ...props
}: ResourceContextMenuProps) {
  const { t } = useTranslation(['timetable']);
  const numberOfSelectedLessons = isSelected
    ? selectedLessonIds.length
    : selectedLessonIds.length + 1;

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
          onOpenSwapTeacherOrRoomDialog();
          handleClose();
        }}
      >
        <>
          <ActionMenuIconWrapper>
            <BuildingGraduateHatIcon />
          </ActionMenuIconWrapper>
          {t('timetable:swapTeacherOrRoom', {
            count: numberOfSelectedLessons,
          })}
        </>
      </MenuItem>
      <MenuItem
        onClick={(event) => {
          event.preventDefault();
          onOpenDeleteLessonDialog();
          handleClose();
        }}
      >
        <ActionMenuIconWrapper>
          <TrashIcon />
        </ActionMenuIconWrapper>
        {t('timetable:deleteLesson')}
      </MenuItem>
      <Divider />
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
