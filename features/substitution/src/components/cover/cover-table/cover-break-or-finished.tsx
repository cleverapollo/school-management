import { Stack, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { ClockWithXIcon, TeaCupIcon } from '@tyro/icons';
import { BreakCardTooltip } from './cover-card-tooltip';

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
    <BreakCardTooltip timeslotInfo={timeslotInfo}>
      <Stack
        className="event-break-card"
        sx={{
          backgroundColor: 'slate.50',
          borderRadius: 0.75,
          py: 0.75,
          px: 1.5,
          width: '100%',
          minHeight: 52,
          border: '1px dashed',
          borderColor: 'slate.200',
        }}
        alignItems="center"
        justifyContent="center"
      >
        {type === 'break' ? <TeaCupIcon /> : <ClockWithXIcon />}
        <Stack>
          <Typography
            component="span"
            variant="subtitle2"
            lineHeight={1.2}
            mt={0.25}
            fontSize="0.75rem"
            noWrap
          >
            {t(`timetable:${type}`)}
          </Typography>
        </Stack>
      </Stack>
    </BreakCardTooltip>
  );
}
