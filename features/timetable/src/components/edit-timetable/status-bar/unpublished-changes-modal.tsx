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
import { Avatar } from '@tyro/core';
import { TFunction, useTranslation } from '@tyro/i18n';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { UndoIcon } from '@tyro/icons';
import {
  ReturnTypeFromUseUnpublishedTimetableChanges,
  useUnpublishedTimetableChanges,
} from '../../../api/edit-timetable/unpublished-timetable-changes';

dayjs.extend(LocalizedFormat);

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
  const day = dayjs()
    .set('day', lesson.timeslotId?.dayIdx ?? 0)
    .format('ddd');
  const [hour, minute] = lesson.timeslotInfo?.startTime.split(':') ?? [];
  const time =
    hour && minute
      ? dayjs().hour(Number(hour)).minute(Number(minute)).format('LT')
      : '';
  const dayAndTime = day && time ? `${day}, ${time}` : undefined;

  return dayAndTime
    ? t('timetable:subjectGroupAtDayAndTime', {
        subjectGroup: lesson.partyGroup?.name ?? '',
        dayAndTime,
      })
    : lesson.partyGroup?.name;
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
  const { data: publishDiff, isLoading } = useUnpublishedTimetableChanges(
    { liveTimetable: true },
    open
  );

  const { lessonDiffs } = publishDiff ?? { lessonDiffs: [] };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>{t('timetable:unpublishedChanges')}</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
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

                console.log({
                  newLesson,
                  oldLesson,
                  lessonAlwaysWithValues,
                });

                const subject =
                  lessonAlwaysWithValues.partyGroup?.__typename ===
                  'SubjectGroup'
                    ? lessonAlwaysWithValues.partyGroup?.subjects?.[0]
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
                      px: 2,
                      borderRadius: 1.5,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        name={lessonAlwaysWithValues.partyGroup?.name}
                        src={lessonAlwaysWithValues.partyGroup?.avatarUrl}
                        sx={{
                          my: 1,
                          mr: 1,
                          borderRadius: 1,
                          ...bgColorStyle,
                        }}
                      />
                      <Stack>
                        <Typography variant="subtitle2" color="text.primary">
                          {getLessonTitle(t, lessonDiff)}
                        </Typography>
                        {/* <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          {getChangeStatus(editedStudent, t)}
                        </Typography> */}
                      </Stack>
                    </Box>
                    <Tooltip title={t('common:actions.undo')}>
                      <IconButton
                        aria-label={t('common:actions.undo')}
                        onClick={() => console.log('undo')}
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
        {!isLoading && lessonDiffs.length === 0 && (
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
