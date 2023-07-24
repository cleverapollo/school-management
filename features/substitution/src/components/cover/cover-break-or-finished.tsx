import { Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ClockWithXIcon, TeaCupIcon } from '@tyro/icons';
import { CoverCardTooltip } from './cover-card-tooltip';

interface CoverBreakOrFinishedProps {
  type: 'break' | 'finished';
  timeslotInfo: { startTime: string; endTime: string } | null;
}

export function CoverBreakOrFinished({
  type,
  timeslotInfo,
}: CoverBreakOrFinishedProps) {
  const { t } = useTranslation(['timetable']);
  return (
    <CoverCardTooltip timeslotInfo={timeslotInfo}>
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
        {type === 'break' ? <TeaCupIcon /> : <ClockWithXIcon />}
        <Stack>
          <Typography
            component="span"
            variant="subtitle2"
            lineHeight={1.2}
            mt={0.25}
            noWrap
          >
            {t(`timetable:${type}`)}
          </Typography>
        </Stack>
      </Stack>
    </CoverCardTooltip>
  );
}
