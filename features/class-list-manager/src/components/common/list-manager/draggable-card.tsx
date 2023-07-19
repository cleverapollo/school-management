import React from 'react';
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import { Avatar, usePreferredNameLayout } from '@tyro/core';
import {
  Box,
  IconButton,
  Stack,
  Theme,
  Tooltip,
  Typography,
} from '@mui/material';
import { CheckmarkIcon, CloseIcon } from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Gender } from '@tyro/api';
import { ListManagerState } from './state/types';
import { useListManagerState } from './state';
import { ContextMenu } from './context-menu';
import { useClassListSettings } from '../../../store/class-list-settings';

interface DraggableCardProps {
  index: number;
  groupId: ListManagerState['id'];
  student: ListManagerState['students'][number];
}

interface GetCardStyleProps {
  theme: Theme;
  gender: Gender | undefined | null;
  showGender: boolean;
  isDragging: boolean;
  isCardSelected: boolean;
  isGhosting: boolean;
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined;
}

const getCardStyle = ({
  theme,
  gender,
  showGender,
  isDragging,
  isCardSelected,
  isGhosting,
  draggableStyle,
}: GetCardStyleProps) => {
  // some basic styles to make the items look a bit nicer
  let backgroundColor = 'white';

  if (showGender && gender) {
    backgroundColor = gender === Gender.Male ? 'blue.200' : 'pink.200';
  }

  // change background color if dragging or selected
  if (isDragging) {
    backgroundColor = 'primary.lighter';
  } else if (isCardSelected) {
    backgroundColor = 'primary.light';
  }

  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    userSelect: 'none',
    padding: 0.75,
    marginBottom: 0.75,
    borderRadius: 0.75,
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

export function DraggableCard({ index, student, groupId }: DraggableCardProps) {
  const { t } = useTranslation(['classListManager']);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { displayName } = usePreferredNameLayout();
  const {
    selectedStudentIds,
    draggingStudentId,
    performCardAction,
    deleteDuplicate,
    enableDuplicateStudents,
    includeClassGroupName,
  } = useListManagerState();
  const { showGender } = useClassListSettings();
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
              getCardStyle({
                theme,
                gender: student.gender,
                showGender,
                isDragging: snapshot.isDragging,
                isCardSelected,
                isGhosting,
                draggableStyle: provided.draggableProps.style,
              })
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
                  mr: 1,
                  position: 'relative',
                }}
              >
                <Avatar
                  src={student?.person.avatarUrl}
                  name={name}
                  sx={{ width: 30, height: 30, fontSize: '0.625rem' }}
                />
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
                    width: 30,
                    height: 30,
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
              <Stack>
                <Typography
                  component="span"
                  variant="subtitle2"
                  sx={{ fontSize: '0.75rem', lineHeight: 1.5 }}
                >
                  {name}
                </Typography>
                {includeClassGroupName && student?.classGroupName && (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '0.625rem', lineHeight: 1.5 }}
                  >
                    {student?.classGroupName}
                  </Typography>
                )}
              </Stack>
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
      />
    </>
  );
}
