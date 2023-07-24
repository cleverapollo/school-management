import {
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
  TooltipProps,
  styled,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { getLocaleTimestampFromDateString } from '@tyro/core';

interface CoverCardTooltipProps {
  timeslotInfo: { startTime: string; endTime: string } | null;
  children: React.ReactElement;
}

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.customShadows.card,
    color: theme.palette.text.primary,
  },
}));

function CoverCardTooltipContent({
  timeslotInfo,
}: Pick<CoverCardTooltipProps, 'timeslotInfo'>) {
  const { t } = useTranslation(['common']);

  return (
    <Stack component="dl" direction="row" spacing={2} m={0.5}>
      {timeslotInfo && (
        <Stack>
          <Typography
            variant="caption"
            component="dt"
            color="text.secondary"
            fontWeight="600"
          >
            {t('common:time')}
          </Typography>
          <Typography variant="caption" component="dt" color="blue.500">
            {getLocaleTimestampFromDateString(timeslotInfo.startTime)} -{' '}
            {getLocaleTimestampFromDateString(timeslotInfo.endTime)}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

export function CoverCardTooltip({
  timeslotInfo,
  children,
}: CoverCardTooltipProps) {
  if (!timeslotInfo) {
    return children;
  }

  return (
    <LightTooltip
      title={<CoverCardTooltipContent timeslotInfo={timeslotInfo} />}
      describeChild
      enterDelay={1000}
      enterNextDelay={1000}
      placement="right"
    >
      {children}
    </LightTooltip>
  );
}
