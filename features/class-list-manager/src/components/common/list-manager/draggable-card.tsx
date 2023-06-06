import React from 'react';
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import { Box, IconButton, Theme, Tooltip, Typography } from '@mui/material';
import { CheckmarkIcon, CloseIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { ListManagerState } from './state/types';
import { ReturnTypeOfUseListManagerState } from './state';
import { ContextMenu } from './context-menu';

type CardProps = ReturnTypeOfUseListManagerState['cardProps'];

interface DraggableCardProps extends CardProps {
  index: number;
  groupId: ListManagerState['id'];
  student: ListManagerState['students'][number];
  enableDuplicateStudents?: boolean;
}

const getCardStyle = (
  theme: Theme,
  isDragging: boolean,
  isSelected: boolean,
  isGhosting: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => {
  // some basic styles to make the items look a bit nicer
  let backgroundColor = 'white';

  // change background color if dragging or selected
  if (isDragging) {
    backgroundColor = 'primary.lighter';
  } else if (isSelected) {
    backgroundColor = 'primary.light';
  }

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
    padding: 1,
    marginBottom: 1,
    borderRadius: 1,
    opacity: isGhosting ? 0.8 : 1,
    backgroundColor,
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDuration: '150ms',
    transitionProperty: 'background-color, opacity',
    position: 'relative',
    ...(isDragging && { boxShadow: theme.customShadows.z24 }),

    // styles we need to apply on draggables
    ...draggableStyle,
  } as const;
};

export function DraggableCard({
  index,
  student,
  groupId,
  performCardAction,
  selectedStudentIds,
  draggingStudentId,
  contextMenuProps,
  deleteDuplicate,
  enableDuplicateStudents,
}: DraggableCardProps) {
  const { t } = useTranslation(['classListManager']);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { displayName } = usePreferredNameLayout();
  const name = displayName(student?.person);
  const isCardSelected = selectedStudentIds.includes(student.id);
  const showSelectionCount =
    draggingStudentId === student.id && selectedStudentIds.length > 1;
  const isGhosting =
    isCardSelected &&
    Boolean(draggingStudentId) &&
    draggingStudentId !== student.id;

  const onClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!event.defaultPrevented && event.button === 0) {
      event.preventDefault();
      performCardAction(event, student.id);
    }
  };

  const onKeydown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    snapshot: DraggableStateSnapshot
  ) => {
    if (
      !event.defaultPrevented &&
      snapshot.isDragging &&
      event.key === 'Enter'
    ) {
      event.preventDefault();
      performCardAction(event, student.id);
    }
  };

  const onTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!event.defaultPrevented) {
      event.preventDefault();
      performCardAction(event, student.id);
    }
  };

  return (
    <>
      <Draggable draggableId={student.id} index={index}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={(theme) =>
              getCardStyle(
                theme,
                snapshot.isDragging,
                isCardSelected,
                isGhosting,
                provided.draggableProps.style
              )
            }
            onClick={onClick}
            onKeyDown={(event) => onKeydown(event, snapshot)}
            onTouchEnd={onTouchEnd}
            onContextMenu={(event) => {
              event.preventDefault();
              setAnchorEl(event.currentTarget);
            }}
          >
            {showSelectionCount && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  width: 26,
                  height: 26,
                  color: 'white',
                }}
              >
                <Typography component="span" variant="subtitle2">
                  {selectedStudentIds.length}
                </Typography>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  my: 0.5,
                  mr: 1.5,
                  position: 'relative',
                }}
              >
                <Avatar src={student?.person.avatarUrl} name={name} />
                <Box
                  aria-hidden
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    width: 40,
                    height: 40,
                    opacity: isCardSelected ? 1 : 0,
                    color: 'primary.main',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDuration: '150ms',
                    transitionProperty: 'opacity',
                    '& svg path': {
                      strokeWidth: 3,
                    },
                  }}
                >
                  <CheckmarkIcon />
                </Box>
              </Box>
              <Typography component="span" variant="subtitle1">
                {name}
              </Typography>
            </Box>
            {student.isDuplicate && (
              <Tooltip title={t('classListManager:removeDuplicateStudent')}>
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    deleteDuplicate(groupId, student.id);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )}
      </Draggable>
      <ContextMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        studentId={student.id}
        studentIndex={index}
        groupId={groupId}
        enableDuplicateStudents={enableDuplicateStudents}
        {...contextMenuProps}
      />
    </>
  );
}
