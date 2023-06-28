import { useMemo, useState } from 'react';
import { Box, Menu, MenuItem, MenuProps } from '@mui/material';
import {
  ChevronRightIcon,
  ReplyIcon,
  UserGroupTwoIcon,
  UserIcon,
} from '@tyro/icons';
import { ActionMenuIconWrapper } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ListManagerContextValue, useListManagerState } from './state';
import { ListManagerState } from './state/types';

interface CardRightClickMenuProps extends MenuProps {
  studentId: string;
  studentIndex: number;
  enableDuplicateStudents?: boolean;
  groupId: ListManagerState['id'];
}

interface GroupSelectSubMenuProps
  extends Pick<MenuProps, 'anchorEl' | 'open' | 'onClose'> {
  state: ListManagerContextValue['state'];
  groupId: ListManagerState['id'];
  includeUnassigned?: boolean;
  onSelect?: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    groupId: string
  ) => void;
}

function GroupSelectSubMenu({
  anchorEl,
  open,
  onClose,
  state,
  groupId,
  includeUnassigned,
  onSelect,
}: GroupSelectSubMenuProps) {
  const groupsWithoutCurrent = useMemo(
    () =>
      state.filter(({ id }) =>
        id === 'unassigned' ? includeUnassigned : id !== groupId
      ),
    [state, groupId, includeUnassigned]
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      hideBackdrop
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{
        ml: 1.25,
        pointerEvents: 'none',
        '& li': {
          fontSize: '0.875rem',
        },
      }}
    >
      <Box sx={{ pointerEvents: 'auto' }}>
        {groupsWithoutCurrent.map(({ id, name }) => (
          <MenuItem
            key={id}
            onClick={(event) => {
              if (onSelect) {
                onSelect(event, String(id));
              }
            }}
          >
            {name}
          </MenuItem>
        ))}
      </Box>
    </Menu>
  );
}

export function ContextMenu({
  studentId,
  studentIndex,
  groupId,
  enableDuplicateStudents,
  ...props
}: CardRightClickMenuProps) {
  const { t } = useTranslation(['classListManager']);
  const { state, selectedStudentIds, duplicateStudents, moveStudents } =
    useListManagerState();
  const isMultipleSelected = selectedStudentIds.length > 1;
  const [subMenuContext, setSubMenuContext] = useState<null | {
    anchorEl: Element;
    includeUnassigned: boolean;
    onSelect: (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      groupId: string
    ) => void;
  }>(null);

  const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.preventDefault();
    setSubMenuContext(null);
    props.onClose?.({}, 'backdropClick');
  };

  const getMoveStudentContext = (
    event: React.MouseEvent | React.FocusEvent
  ) => {
    const studentIds = isMultipleSelected ? selectedStudentIds : [studentId];
    setSubMenuContext({
      anchorEl: event.currentTarget,
      includeUnassigned: true,
      onSelect: (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        id: string
      ) => {
        moveStudents(
          studentIds,
          {
            droppableId: String(groupId),
            index: studentIndex,
          },
          {
            droppableId: id,
            index: 0,
          }
        );
        handleClose(e);
      },
    });
  };

  const getDuplicateStudentContext = (
    event: React.MouseEvent | React.FocusEvent
  ) => {
    const studentIds = isMultipleSelected ? selectedStudentIds : [studentId];
    setSubMenuContext({
      anchorEl: event.currentTarget,
      includeUnassigned: false,
      onSelect: (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        id: string
      ) => {
        duplicateStudents(Number(id), studentIds);
        handleClose(e);
      },
    });
  };

  return (
    <>
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
            justifyContent: 'space-between',
            alignItems: 'center',

            '& > div': {
              display: 'flex',
              alignItems: 'center',
              mr: 1,
            },
          },
          ...props.sx,
        }}
      >
        <MenuItem
          onMouseEnter={getMoveStudentContext}
          onFocus={getMoveStudentContext}
        >
          <Box>
            <ActionMenuIconWrapper>
              <ReplyIcon sx={{ transform: 'scaleX(-1)' }} />
            </ActionMenuIconWrapper>
            {t('classListManager:moveStudent', {
              count: selectedStudentIds.length || 1,
            })}
          </Box>
          <ChevronRightIcon />
        </MenuItem>
        {enableDuplicateStudents && (
          <MenuItem
            onMouseEnter={getDuplicateStudentContext}
            onFocus={getDuplicateStudentContext}
          >
            <Box>
              <ActionMenuIconWrapper>
                {isMultipleSelected ? <UserGroupTwoIcon /> : <UserIcon />}
              </ActionMenuIconWrapper>
              {t('classListManager:duplicateStudent', {
                count: selectedStudentIds.length || 1,
              })}
            </Box>
            <ChevronRightIcon />
          </MenuItem>
        )}
      </Menu>
      <GroupSelectSubMenu
        {...subMenuContext}
        open={Boolean(subMenuContext)}
        groupId={groupId}
        state={state}
        onClose={() => setSubMenuContext(null)}
      />
    </>
  );
}
