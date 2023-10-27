import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import {
  Avatar,
  ReturnTypeDisplayNames,
  usePreferredNameLayout,
} from '@tyro/core';

import { Tt_DiffType } from '@tyro/api';
import { TFunction, useTranslation } from '@tyro/i18n';
import { UndoIcon } from '@tyro/icons';
import { useMemo } from 'react';
import { useTtResetChanges } from '../../../../api/edit-timetable/reset-changes';
import { ReturnTypeFromUseUnpublishedTimetableChanges } from '../../../../api/edit-timetable/unpublished-timetable-changes';
import { ListHeader } from './list-header';
import { getShortLessonDayTime } from '../../../../utils/get-lesson-day-time';
import { NoChangesPlaceholder } from './no-changes-placeholder';

interface LessonsUpdatesListProps {
  timetableId: number;
  lessonDiffs: ReturnTypeFromUseUnpublishedTimetableChanges['lessonDiffs'];
}

function getLessonTitle(
  t: TFunction<
    ('common' | 'timetable')[],
    undefined,
    ('common' | 'timetable')[]
  >,
  {
    newLesson,
    oldLesson,
  }: ReturnTypeFromUseUnpublishedTimetableChanges['lessonDiffs'][number]
) {
  const lesson = oldLesson ?? newLesson;
  const dayAndTime = getShortLessonDayTime(lesson);

  return dayAndTime
    ? t('timetable:subjectGroupAtDayAndTime', {
        subjectGroup: lesson.partyGroup?.name ?? '',
        dayAndTime,
      })
    : lesson.partyGroup?.name;
}

function getChangeList(
  t: TFunction<
    ('common' | 'timetable')[],
    undefined,
    ('common' | 'timetable')[]
  >,
  displayNames: ReturnTypeDisplayNames,
  lessonDiff: ReturnTypeFromUseUnpublishedTimetableChanges['lessonDiffs'][number]
) {
  const changes: string[] = [];
  const { oldLesson, newLesson } = lessonDiff;

  if (lessonDiff.timeslotChanged) {
    const oldDayAndTime = getShortLessonDayTime(oldLesson);
    const newDayAndTime = getShortLessonDayTime(newLesson);
    changes.push(
      `${t('common:dayAndTime')}: ${oldDayAndTime ?? '-'} → ${
        newDayAndTime ?? '-'
      }`
    );
  }

  if (lessonDiff.roomChanged) {
    changes.push(
      `${t('common:room', { count: 1 })}: ${oldLesson?.room?.name ?? '-'} → ${
        newLesson?.room?.name ?? '-'
      }`
    );
  }

  if (lessonDiff.teachersChanged) {
    const oldTeachers =
      oldLesson.teachers.length > 0
        ? displayNames(
            oldLesson.teachers.map(({ person }) => person),
            ' & '
          )
        : '-';
    const newTeachers =
      newLesson.teachers.length > 0
        ? displayNames(
            newLesson.teachers.map(({ person }) => person),
            ' & '
          )
        : '-';
    changes.push(
      `${t('common:teachers')}: ${oldTeachers} → ${newTeachers ?? '-'}`
    );
  }

  return changes;
}

export function LessonsUpdatesList({
  timetableId,
  lessonDiffs,
}: LessonsUpdatesListProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { displayNames } = usePreferredNameLayout();
  const { mutateAsync: resetChanges } = useTtResetChanges();

  const sortedDiffs = useMemo(
    () =>
      lessonDiffs.sort((diffA, diffB) =>
        getLessonTitle(t, diffA).localeCompare(getLessonTitle(t, diffB))
      ),
    [t, lessonDiffs]
  );

  return (
    <Box>
      <ListHeader variant="subtitle1">
        {t('timetable:lessonUpdates')}
      </ListHeader>
      {sortedDiffs.length > 0 ? (
        <Stack
          component="ul"
          sx={{
            m: 0,
            px: 1,
            '@media (hover: hover) and (pointer: fine)': {
              '& li button': {
                opacity: 0,
              },

              '& li:focus-within, & li:hover': {
                bgcolor: 'primary.lighter',

                '& button': {
                  opacity: 1,
                },
              },
            },
          }}
        >
          {sortedDiffs.map((lessonDiff) => {
            const { newLesson, oldLesson } = lessonDiff;
            const lessonAlwaysWithValues = newLesson ?? oldLesson ?? {};
            const id = JSON.stringify(lessonAlwaysWithValues.id);
            const changeList = getChangeList(t, displayNames, lessonDiff);
            const { partyGroup } = lessonAlwaysWithValues;

            const subject =
              partyGroup?.__typename === 'SubjectGroup'
                ? partyGroup?.subjects?.[0]
                : { colour: 'default' };

            const bgColorStyle = subject?.colour
              ? { bgcolor: `${subject.colour}.500` }
              : {};

            return (
              <Stack
                component="li"
                direction="row"
                key={id}
                spacing={1}
                alignItems="center"
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 1.5,
                  justifyContent: 'space-between',
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    name={partyGroup?.name}
                    src={partyGroup?.avatarUrl}
                    sx={{
                      mr: 1,
                      borderRadius: 1,
                      ...bgColorStyle,
                    }}
                  />
                  <Stack>
                    <Typography variant="subtitle2" color="text.primary">
                      {getLessonTitle(t, lessonDiff)}
                    </Typography>
                    {lessonDiff.type === Tt_DiffType.New && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {t('timetable:lessonAdded')}
                      </Typography>
                    )}
                    {lessonDiff.type === Tt_DiffType.Deleted && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {t('timetable:lessonRemoved')}
                      </Typography>
                    )}
                    {lessonDiff.type === Tt_DiffType.Updated &&
                      changeList.map((change) => (
                        <Typography
                          key={change}
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {change}
                        </Typography>
                      ))}
                  </Stack>
                </Box>
                <Tooltip title={t('common:actions.undo')}>
                  <IconButton
                    aria-label={t('common:actions.undo')}
                    onClick={() =>
                      resetChanges({
                        timetableId,
                        lessons: [
                          {
                            lessonId: lessonAlwaysWithValues.id,
                          },
                        ],
                      })
                    }
                    color="primary"
                  >
                    <UndoIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
            );
          })}
        </Stack>
      ) : (
        <NoChangesPlaceholder />
      )}
    </Box>
  );
}
