import { Box, Button, Card, Divider, Stack } from '@mui/material';
import { useMemo } from 'react';
import { useTtPublishTimetable } from '../../../api/edit-timetable/publish-timetable';
import { useTimetables } from '../../../api/common/timetables';

export function EditTimetableStatusBar() {
  const { data: timetables } = useTimetables({ liveTimetable: true });
  const liveTimetable = useMemo(() => timetables?.[0], [timetables]);

  const { mutateAsync: publishTimetable } = useTtPublishTimetable();

  return (
    <Box>
      <Card variant="outlined" sx={{ p: 1.25, display: 'inline-block' }}>
        <Stack direction="row" alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <Stack spacing={0.25}>
            <Box
              component="dt"
              sx={{
                fontSize: '0.75rem',
                px: 2,
                color: 'slate.600',
                lineHeight: 34 / 12,
              }}
            >
              Change stats
            </Box>
            <Box
              sx={{
                px: 1,
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
                onClick={() => console.log('open unpublished changes')}
              >
                20 unpublished changes
              </Button>
            </Box>
          </Stack>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Button
            size="small"
            sx={{
              fontSize: '0.75rem',
              justifyContent: 'flex-start',
              minWidth: 'auto',
              px: 1,
            }}
            variant="contained"
            onClick={() =>
              publishTimetable({ timetableId: liveTimetable?.timetableId ?? 0 })
            }
          >
            Publish
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
