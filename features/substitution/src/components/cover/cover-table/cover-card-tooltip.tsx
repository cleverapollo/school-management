import {
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
  TooltipProps,
  styled,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  getLocaleTimestampFromDateString,
  usePreferredNameLayout,
} from '@tyro/core';
import { StaffAttendee } from '../../../utils/cover-utils';

interface CoverCardTooltipProps {
  timeslotInfo: { startTime: string; endTime: string } | null;
  children: React.ReactElement;
  additionalTeachers?: StaffAttendee['partyInfo']['person'][];
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
  additionalTeachers,
}: Pick<CoverCardTooltipProps, 'timeslotInfo' | 'additionalTeachers'>) {
  const { t } = useTranslation(['common']);
  const { displayName } = usePreferredNameLayout();

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
      {Array.isArray(additionalTeachers) && additionalTeachers.length > 0 && (
        <Stack>
          <>
            <Typography
              variant="caption"
              component="dt"
              color="text.secondary"
              fontWeight="600"
            >
              {t('common:additionalTeacher', {
                count: additionalTeachers.length,
              })}
            </Typography>
            {additionalTeachers.map((person) => (
              <Typography key={person.partyId} variant="caption" component="dt">
                {displayName(person)}
              </Typography>
            ))}
          </>
        </Stack>
      )}
    </Stack>
  );
}

export function CoverCardTooltip({
  timeslotInfo,
  children,
  additionalTeachers,
}: CoverCardTooltipProps) {
  if (!timeslotInfo) {
    return children;
  }

  return (
    <LightTooltip
      title={
        <CoverCardTooltipContent
          timeslotInfo={timeslotInfo}
          additionalTeachers={additionalTeachers}
        />
      }
      describeChild
      enterDelay={1000}
      enterNextDelay={1000}
      placement="right"
    >
      {children}
    </LightTooltip>
  );
}
