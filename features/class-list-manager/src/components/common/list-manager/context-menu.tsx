import { useMemo, useState } from 'react';
import { Box, Menu, MenuItem, MenuProps } from '@mui/material';
import { ChevronRightIcon, UserGroupTwoIcon, UserIcon } from '@tyro/icons';
import { ActionMenuIconWrapper } from '@tyro/core';
import { ReturnTypeOfUseListManagerState } from './state';
import { ListManagerState } from './state/types';

type ContextMenuProps =
  ReturnTypeOfUseListManagerState['cardProps']['contextMenuProps'];

interface CardRightClickMenuProps extends MenuProps, ContextMenuProps {
  studentId: string;
  groupId: ListManagerState['id'];
}

interface GroupSelectSubMenuProps
  extends Pick<MenuProps, 'anchorEl' | 'open' | 'onClose'> {
  groups: ContextMenuProps['groups'];
  groupId: ListManagerState['id'];
  onSelect?: (groupId: number) => void;
}

function GroupSelectSubMenu({
  anchorEl,
  open,
  onClose,
  groups,
  groupId,
  onSelect,
}: GroupSelectSubMenuProps) {
  const groupsWithoutCurrent = useMemo(
    () => groups.filter(({ partyId }) => partyId !== groupId),
    [groups, groupId]
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
        ml: 1,
        '& li': {
          fontSize: '0.875rem',
        },
      }}
    >
      {groupsWithoutCurrent.map(({ partyId, name }) => (
        <MenuItem
          key={partyId}
          onClick={() => {
            if (onSelect) {
              onSelect(partyId);
            }
          }}
        >
          {name}
        </MenuItem>
      ))}
    </Menu>
  );
}

export function ContextMenu({
  selectedStudentIds,
  studentId,
  groupId,
  groups,
  duplicateStudents,
  ...props
}: CardRightClickMenuProps) {
  const [subMenuContext, setSubMenuContext] = useState<null | {
    anchorEl: Element;
    onSelect: (groupId: number) => void;
  }>(null);

  const handleClose = () => {
    setSubMenuContext(null);
    props.onClose?.({}, 'backdropClick');
  };

  const getSingleStudentContext = (
    event: React.MouseEvent | React.FocusEvent
  ) =>
    setSubMenuContext({
      anchorEl: event.currentTarget,
      onSelect: (id: number) => {
        duplicateStudents(id, [studentId]);
        handleClose();
      },
    });

  const getSelectedStudentContext = (
    event: React.MouseEvent | React.FocusEvent
  ) =>
    setSubMenuContext({
      anchorEl: event.currentTarget,
      onSelect: (id: number) => {
        duplicateStudents(id, selectedStudentIds);
        handleClose();
      },
    });

  return (
    <>
      <Menu
        {...props}
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
          onMouseEnter={getSingleStudentContext}
          onFocus={getSingleStudentContext}
        >
          <Box>
            <ActionMenuIconWrapper>
              <UserIcon />
            </ActionMenuIconWrapper>
            Duplicate student
          </Box>
          <ChevronRightIcon />
        </MenuItem>
        {selectedStudentIds.length > 1 && (
          <MenuItem
            onMouseEnter={getSelectedStudentContext}
            onFocus={getSelectedStudentContext}
          >
            <Box>
              <ActionMenuIconWrapper>
                <UserGroupTwoIcon />
              </ActionMenuIconWrapper>
              Duplicate selected students
            </Box>
            <ChevronRightIcon />
          </MenuItem>
        )}
      </Menu>
      <GroupSelectSubMenu
        {...subMenuContext}
        open={Boolean(subMenuContext)}
        groupId={groupId}
        groups={groups}
        onClose={() => setSubMenuContext(null)}
      />
    </>
  );
}
