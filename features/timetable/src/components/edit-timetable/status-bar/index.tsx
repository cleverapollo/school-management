import { Box, Button, Card, Divider, Stack } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from '@tyro/i18n';
import { CalendarUploadIcon } from '@tyro/icons';
import { useDisclosure } from '@tyro/core';
import { useTtPublishTimetable } from '../../../api/edit-timetable/publish-timetable';
import { useTimetables } from '../../../api/common/timetables';
import { TimetableStatusDetails } from './status-details';
import { UnpublishedChangesModal } from './unpublished-changes-modal';

export function EditTimetableStatusBar() {
  const { t } = useTranslation(['timetable']);
  const { data: timetables } = useTimetables({ liveTimetable: true });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const liveTimetable = useMemo(() => timetables?.[0], [timetables]);

  const { mutateAsync: publishTimetable } = useTtPublishTimetable();

  return (
    <>
      <Box>
        <Card
          variant="outlined"
          sx={{ p: 1.25, pr: 2.5, display: 'inline-block' }}
        >
          <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
            <Stack>
              <Box
                component="dt"
                sx={{
                  fontSize: '0.75rem',
                  px: 2,
                  color: 'slate.600',
                  lineHeight: 34 / 12,
                }}
              >
                {t('timetable:totalChanges')}
              </Box>
              <Box
                sx={{
                  px: 1,
                  my: 0.25,
                }}
              >
                <Button
                  size="small"
                  sx={{
                    fontSize: '0.75rem',
                    justifyContent: 'flex-start',
                    minWidth: 'auto',
                    px: 1,
                  }}
                  onClick={() => onOpen()}
                >
                  {t('timetable:unpublishedChanges', {
                    count: liveTimetable?.liveStatus?.totalChanges || 0,
                  })}
                </Button>
              </Box>
            </Stack>
            <Divider orientation="vertical" flexItem sx={{ ml: 1, mr: 2.5 }} />
            <TimetableStatusDetails {...(liveTimetable?.liveStatus ?? {})} />
            <Divider orientation="vertical" flexItem sx={{ mx: 2.5 }} />
            <Button
              variant="contained"
              startIcon={<CalendarUploadIcon />}
              onClick={() =>
                publishTimetable({
                  timetableId: liveTimetable?.timetableId ?? 0,
                })
              }
            >
              {t('timetable:publish')}
            </Button>
          </Stack>
        </Card>
      </Box>
      <UnpublishedChangesModal open={isOpen} onClose={onClose} />
    </>
  );
}
