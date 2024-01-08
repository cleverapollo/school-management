import { Divider, Menu, MenuItem, MenuProps } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ActionMenuIconWrapper } from '@tyro/core';
import {
  AddIcon,
  BuildingGraduateHatIcon,
  CalendarUploadIcon,
  EditIcon,
  TrashIcon,
} from '@tyro/icons';
import { usePermissions } from '@tyro/api';

interface ResourceContextMenuProps extends MenuProps {
  selectedLessonIds: string[];
  onOpenSwapTeacherOrRoomDialog: () => void;
  onOpenDeleteLessonDialog: () => void;
  onOpenAddLessonDialog: () => void;
  onOpenEditLessonDialog: () => void;
  onOpenPublishLessonDialog: () => void;
  isSelected: boolean;
  enableSwapTeacher: boolean;
}

export function LessonContextMenu({
  selectedLessonIds,
  onOpenSwapTeacherOrRoomDialog,
  onOpenDeleteLessonDialog,
  onOpenAddLessonDialog,
  onOpenEditLessonDialog,
  onOpenPublishLessonDialog,
  isSelected,
  enableSwapTeacher,
  ...props
}: ResourceContextMenuProps) {
  const { t } = useTranslation(['timetable']);
  const { isTyroUser } = usePermissions();

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
      {enableSwapTeacher && (
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            onOpenSwapTeacherOrRoomDialog();
            handleClose();
          }}
        >
          <ActionMenuIconWrapper>
            <BuildingGraduateHatIcon />
          </ActionMenuIconWrapper>
          {t('timetable:swapTeacherOrRoom', {
            count: numberOfSelectedLessons,
          })}
        </MenuItem>
      )}
      {isTyroUser && (
        <MenuItem
          key="publish"
          onClick={(event) => {
            event.preventDefault();
            onOpenPublishLessonDialog();
            handleClose();
          }}
        >
          <ActionMenuIconWrapper>
            <CalendarUploadIcon />
          </ActionMenuIconWrapper>
          {t('timetable:republishLesson')}
        </MenuItem>
      )}
      {[
        <MenuItem
          key="edit"
          onClick={(event) => {
            event.preventDefault();
            onOpenEditLessonDialog();
            handleClose();
          }}
        >
          <ActionMenuIconWrapper>
            <EditIcon />
          </ActionMenuIconWrapper>
          {t('timetable:editLesson')}
        </MenuItem>,
        <MenuItem
          key="delete"
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
        </MenuItem>,

        <Divider key="divider" />,
        <MenuItem
          key="add"
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
        </MenuItem>,
      ]}
    </Menu>
  );
}
