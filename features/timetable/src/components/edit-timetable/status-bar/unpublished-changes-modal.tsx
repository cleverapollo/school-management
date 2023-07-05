import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  styled,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Avatar,
  LoadingPlaceholder,
  usePreferredNameLayout,
  ReturnTypeDisplayNames,
} from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import { UndoIcon } from '@tyro/icons';
import { useTtResetLessonsChanges } from '../../../api/edit-timetable/reset-lessons';
import {
  ReturnTypeFromUseUnpublishedTimetableChanges,
  useUnpublishedTimetableChanges,
} from '../../../api/edit-timetable/unpublished-timetable-changes';
import { getShortLessonDayTime } from '../../../utils/get-lesson-day-time';

interface UnpublishedChangesModalProps {
  open: boolean;
  onClose: () => void;
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
      `${t('common:room')}: ${oldLesson?.room?.name ?? '-'} → ${
        newLesson?.room?.name ?? '-'
      }`
    );
  }

  if (lessonDiff.teachersChanged) {
    const oldTeachers = oldLesson?.teachers
      ? displayNames(
          oldLesson.teachers.map(({ person }) => person),
          ' & '
        )
      : '-';
    const newTeachers = newLesson?.teachers
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

const SectionHeader = styled(Typography)(({ theme: { palette, spacing } }) => ({
  padding: `0 ${spacing(3)} ${spacing(1)}`,
  borderBottom: '1px solid',
  borderBottomColor: palette.divider,
  position: 'sticky',
  top: 0,
  backgroundColor: palette.background.paper,
  zIndex: 1,
}));

export function UnpublishedChangesModal({
  open,
  onClose,
}: UnpublishedChangesModalProps) {
  const { t } = useTranslation(['common', 'timetable']);
  const { displayNames } = usePreferredNameLayout();
  const { data: publishDiff, isLoading } = useUnpublishedTimetableChanges(
    { liveTimetable: true },
    open
  );

  const { timetableId, lessonDiffs, groupDiffs } = publishDiff ?? {
    timetableId: 0,
    lessonDiffs: [],
    groupDiffs: [],
  };

  const { mutateAsync: resetLessonChanges } = useTtResetLessonsChanges();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>{t('timetable:unpublishedChanges')}</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {isLoading && <LoadingPlaceholder sx={{ minHeight: 200 }} />}
        {lessonDiffs.length > 0 && (
          <>
            <SectionHeader variant="subtitle1">
              {t('timetable:lessonUpdates')}
            </SectionHeader>
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
              {lessonDiffs.map((lessonDiff) => {
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
                        {changeList.map((change) => (
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
                          resetLessonChanges({
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
          </>
        )}
        {!isLoading && lessonDiffs.length === 0 && groupDiffs.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 2,
              border: '1px solid transparent',
            }}
          >
            <Typography
              component="span"
              variant="body2"
              sx={{ color: 'text.secondary' }}
            >
              {t('common:noChangesMade')}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('common:actions.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
