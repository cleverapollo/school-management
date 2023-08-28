import { Box, Button, Card, Divider, Stack, Tooltip } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { CalendarUploadIcon } from '@tyro/icons';
import { useDisclosure } from '@tyro/core';
import { useTimetables } from '../../../api/common/timetables';
import { TimetableStatusDetails } from './status-details';
import { UnpublishedChangesModal } from './unpublished-changes-modal';
import { PublishModal } from './publish-modal';

export function EditTimetableStatusBar() {
  const { t } = useTranslation(['timetable']);
  const { data: timetables } = useTimetables({ liveTimetable: true });
  const {
    isOpen: isUnpublishedChangesModalOpen,
    onOpen: openUnpublishedChangesModal,
    onClose: closeUnpublishedChangesModal,
  } = useDisclosure();
  const {
    isOpen: isPublishModalOpen,
    onOpen: openPublishModal,
    onClose: closePublishModal,
  } = useDisclosure();
  const liveTimetable = timetables?.[0];

  const hasNoChanges = !liveTimetable?.liveStatus?.totalChanges;
  const tooltip = hasNoChanges ? t('timetable:thereAreNoChangesAvailable') : '';

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
                <Tooltip describeChild title={tooltip}>
                  <span>
                    <Button
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        justifyContent: 'flex-start',
                        minWidth: 'auto',
                        px: 1,
                      }}
                      onClick={() => openUnpublishedChangesModal()}
                      disabled={hasNoChanges}
                    >
                      {t('timetable:unpublishedChanges', {
                        count: liveTimetable?.liveStatus?.totalChanges || 0,
                      })}
                    </Button>
                  </span>
                </Tooltip>
              </Box>
            </Stack>
            <Divider orientation="vertical" flexItem sx={{ ml: 1, mr: 2.5 }} />
            <TimetableStatusDetails {...(liveTimetable?.liveStatus ?? {})} />
            <Divider orientation="vertical" flexItem sx={{ mx: 2.5 }} />
            <Tooltip describeChild title={tooltip}>
              <span>
                <Button
                  variant="contained"
                  startIcon={<CalendarUploadIcon />}
                  onClick={openPublishModal}
                  disabled={hasNoChanges}
                >
                  {t('timetable:publish')}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Card>
      </Box>
      <UnpublishedChangesModal
        open={isUnpublishedChangesModalOpen}
        onClose={closeUnpublishedChangesModal}
      />
      <PublishModal open={isPublishModalOpen} onClose={closePublishModal} />
    </>
  );
}
