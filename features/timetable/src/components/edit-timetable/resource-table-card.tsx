import { memo, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ClockWithXIcon, TeaCupIcon } from '@tyro/icons';
import {
  Lesson,
  Resource,
  useResourceTable,
} from '../../hooks/use-resource-table';
import { getResourceName } from '../../utils/get-resource-name';
import { ResourceCardTooltip } from './resource-card-tooltip';
import { LessonContextMenu } from './lesson-context-menu';
import { Period } from './types';

export type UseResourceTableReturnType = ReturnType<typeof useResourceTable>;

interface ResourceTableCardProps {
  resource: Resource;
  multipleGrids: boolean;
  searchValue: string;
  isLessonSelected: UseResourceTableReturnType['isLessonSelected'];
  toggleLessonSelection: UseResourceTableReturnType['toggleLessonSelection'];
  selectedLessonIds: UseResourceTableReturnType['selectedLessonIds'];
  onOpenSwapTeacherOrRoomDialog: (anchorLesson: Lesson) => void;
  onOpenDeleteLessonDialog: (anchorLesson: Lesson) => void;
  onOpenEditLessonDialog: (anchorLesson: Lesson) => void;
  onOpenAddLessonDialog: (anchorLesson: Period) => void;
  onOpenPublishLessonDialog: (anchorLesson: Lesson) => void;
  period: Period;
}

type GroupCardProps = {
  lesson: Lesson;
  searchValue: string;
  isLessonSelected: UseResourceTableReturnType['isLessonSelected'];
  toggleLessonSelection: UseResourceTableReturnType['toggleLessonSelection'];
  selectedLessonIds: UseResourceTableReturnType['selectedLessonIds'];
  onOpenSwapTeacherOrRoomDialog: (anchorLesson: Lesson) => void;
  onOpenDeleteLessonDialog: (anchorLesson: Lesson) => void;
  onOpenEditLessonDialog: (anchorLesson: Lesson) => void;
  onOpenAddLessonDialog: (anchorLesson: Period) => void;
  onOpenPublishLessonDialog: (anchorLesson: Lesson) => void;
  period: Period;
  enableSwapTeacher: boolean;
};

interface PlaceholderLessonProps {
  resource: Extract<Resource, { type: 'break' | 'finished' }>;
  multipleGrids: boolean;
}

function PlaceholderLesson({
  resource,
  multipleGrids,
}: PlaceholderLessonProps) {
  const { t } = useTranslation(['timetable']);
  return (
    <ResourceCardTooltip timeslotInfo={resource.timeslotInfo}>
      <Stack
        sx={{
          backgroundColor: 'slate.50',
          borderRadius: 0.75,
          py: 0.75,
          px: 1.5,
          maxWidth: 240,
          minHeight: 52,
          border: '1px dashed',
          borderColor: 'slate.200',
        }}
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={1}
      >
        {resource.type === 'break' ? <TeaCupIcon /> : <ClockWithXIcon />}
        <Stack>
          <Typography
            component="span"
            variant="subtitle2"
            lineHeight={1.2}
            mt={0.25}
            noWrap
          >
            {t(`timetable:${resource.type}`)}
          </Typography>
          {multipleGrids && resource.gridId && (
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
              lineHeight={1.2}
              noWrap
            >
              {t('timetable:forGridId', { id: resource.gridId })}
            </Typography>
          )}
        </Stack>
      </Stack>
    </ResourceCardTooltip>
  );
}

function GroupCard({
  lesson,
  searchValue,
  isLessonSelected,
  toggleLessonSelection,
  onOpenSwapTeacherOrRoomDialog,
  onOpenDeleteLessonDialog,
  onOpenEditLessonDialog,
  onOpenAddLessonDialog,
  onOpenPublishLessonDialog,
  selectedLessonIds,
  period,
  enableSwapTeacher,
}: GroupCardProps) {
  const { displayName, displayNames } = usePreferredNameLayout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isSelected = isLessonSelected(lesson);
  const isContextMenuOpen = Boolean(anchorEl);

  const partyGroup = lesson?.partyGroup;

  const subject =
    partyGroup.__typename === 'SubjectGroup' ? partyGroup.subjects[0] : null;
  const name = getResourceName(lesson);
  const subjectGroupName =
    partyGroup.__typename === 'SubjectGroup' ? partyGroup.name : null;
  const room = lesson.room?.name;
  const [teacher, ...additionalTeachers] = lesson.teachers;

  const isMatched = useMemo(() => {
    if (!searchValue) return true;

    const searchValueLower = searchValue.toLowerCase();
    const teachersPerson = lesson.teachers.map(({ person }) => person);
    const searchValues = [
      name.toLowerCase(),
      subjectGroupName?.toLowerCase(),
      room?.toLowerCase(),
      displayNames(teachersPerson).toLowerCase(),
    ];

    return searchValues.some((value) => value?.includes(searchValueLower));
  }, [searchValue, name, subjectGroupName, room, lesson.teachers]);

  const opacity = isMatched ? 1 : 0.2;
  const color = isMatched && subject?.colour ? subject.colour : 'slate';
  const borderColor =
    isSelected || isContextMenuOpen ? `${color}.600` : 'white';

  return (
    <>
      <ResourceCardTooltip
        timeslotInfo={lesson.timeslotInfo}
        additionalTeachers={additionalTeachers}
      >
        <Box
          sx={{
            backgroundColor: `${color}.100`,
            opacity,
            borderRadius: 0.75,
            width: 240,
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDuration: '150ms',
            transitionProperty: 'background-color, opacity',
            border: '2px solid',
            borderColor,
            cursor: 'pointer',
            userSelect: 'none',
          }}
          role="button"
          tabIndex={0}
          onClick={(event) => {
            event.preventDefault();
            toggleLessonSelection(event, lesson);
          }}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.preventDefault();
            setAnchorEl(event.currentTarget);
          }}
        >
          <Stack
            direction="row"
            sx={{ alignItems: 'stretch', height: '100%', p: 0.75, pr: 1.25 }}
          >
            <Box
              sx={{
                width: 3,
                borderRadius: 1.5,
                backgroundColor: `${color}.main`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDuration: '150ms',
                transitionProperty: 'background-color',
                mr: 0.75,
              }}
            />
            <Stack sx={{ overflow: 'hidden', flex: 1 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                  {name}
                </Typography>
                <Typography variant="subtitle2" noWrap>
                  {room}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ flex: 1 }}
                >
                  {displayName(teacher?.person)}
                  {additionalTeachers.length > 0
                    ? ` +${additionalTeachers.length}`
                    : ''}
                </Typography>
                {subjectGroupName && (
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {subjectGroupName}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </ResourceCardTooltip>
      <LessonContextMenu
        anchorEl={anchorEl}
        open={isContextMenuOpen}
        onClose={() => setAnchorEl(null)}
        selectedLessonIds={selectedLessonIds}
        enableSwapTeacher={enableSwapTeacher}
        onOpenSwapTeacherOrRoomDialog={() =>
          onOpenSwapTeacherOrRoomDialog(lesson)
        }
        onOpenDeleteLessonDialog={() => onOpenDeleteLessonDialog(lesson)}
        onOpenAddLessonDialog={() => onOpenAddLessonDialog(period)}
        onOpenEditLessonDialog={() => onOpenEditLessonDialog(lesson)}
        onOpenPublishLessonDialog={() => onOpenPublishLessonDialog(lesson)}
        isSelected={isSelected}
      />
    </>
  );
}

export const ResourceTableCard = memo(
  ({ resource, ...props }: ResourceTableCardProps) => {
    if (resource.type) {
      return (
        <PlaceholderLesson
          resource={resource}
          multipleGrids={props.multipleGrids}
        />
      );
    }

    return (
      <GroupCard
        lesson={resource}
        enableSwapTeacher={resource.teachers?.length === 1}
        {...props}
      />
    );
  }
);

if (process.env.NODE_ENV === 'development') {
  ResourceTableCard.displayName = 'ResourceTableCard';
}
