import { useMemo, useState } from 'react';
import { Box, Menu, MenuItem, MenuProps } from '@mui/material';
import { ChevronRightIcon, UserGroupTwoIcon, UserIcon } from '@tyro/icons';
import { ActionMenuIconWrapper } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
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
  onSelect?: (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    groupId: number
  ) => void;
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
        ml: 1.25,
        pointerEvents: 'none',
        '& li': {
          fontSize: '0.875rem',
        },
      }}
    >
      <Box sx={{ pointerEvents: 'auto' }}>
        {groupsWithoutCurrent.map(({ partyId, name }) => (
          <MenuItem
            key={partyId}
            onClick={(event) => {
              if (onSelect) {
                onSelect(event, partyId);
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
  selectedStudentIds,
  studentId,
  groupId,
  groups,
  duplicateStudents,
  ...props
}: CardRightClickMenuProps) {
  const { t } = useTranslation(['classListManager']);
  const [subMenuContext, setSubMenuContext] = useState<null | {
    anchorEl: Element;
    onSelect: (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>,
      groupId: number
    ) => void;
  }>(null);

  const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.preventDefault();
    setSubMenuContext(null);
    props.onClose?.({}, 'backdropClick');
  };

  const getSingleStudentContext = (
    event: React.MouseEvent | React.FocusEvent
  ) =>
    setSubMenuContext({
      anchorEl: event.currentTarget,
      onSelect: (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        id: number
      ) => {
        duplicateStudents(id, [studentId]);
        handleClose(e);
      },
    });

  const getSelectedStudentContext = (
    event: React.MouseEvent | React.FocusEvent
  ) =>
    setSubMenuContext({
      anchorEl: event.currentTarget,
      onSelect: (
        e: React.MouseEvent<HTMLLIElement, MouseEvent>,
        id: number
      ) => {
        duplicateStudents(id, selectedStudentIds);
        handleClose(e);
      },
    });

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
        {selectedStudentIds.length > 1 ? (
          <MenuItem
            onMouseEnter={getSelectedStudentContext}
            onFocus={getSelectedStudentContext}
          >
            <Box>
              <ActionMenuIconWrapper>
                <UserGroupTwoIcon />
              </ActionMenuIconWrapper>
              {t('classListManager:duplicateSelectedStudents')}
            </Box>
            <ChevronRightIcon />
          </MenuItem>
        ) : (
          <MenuItem
            onMouseEnter={getSingleStudentContext}
            onFocus={getSingleStudentContext}
          >
            <Box>
              <ActionMenuIconWrapper>
                <UserIcon />
              </ActionMenuIconWrapper>
              {t('classListManager:duplicateStudent')}
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
