import {
  Stack,
  Tooltip,
  Typography,
  tooltipClasses,
  TooltipProps,
  styled,
} from '@mui/material';
import { usePreferredNameLayout } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Lesson } from '../../hooks/use-resource-table';

interface ResourceCardTooltipProps {
  timeslotInfo: Lesson['timeslotInfo'];
  additionalTeachers?: Lesson['teachers'];
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

function ResourceCardTooltipContent({
  timeslotInfo,
  additionalTeachers,
}: Pick<ResourceCardTooltipProps, 'additionalTeachers' | 'timeslotInfo'>) {
  const { displayName } = usePreferredNameLayout();
  const { t } = useTranslation(['common']);

  return (
    <Stack component="dl" direction="row" spacing={2} m={0.5}>
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
          {timeslotInfo?.startTime} - {timeslotInfo?.endTime}
        </Typography>
      </Stack>
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
            {additionalTeachers.map((teacher) => (
              <Typography
                key={teacher.person.partyId}
                variant="caption"
                component="dt"
              >
                {displayName(teacher.person)}
              </Typography>
            ))}
          </>
        </Stack>
      )}
    </Stack>
  );
}

export function ResourceCardTooltip({
  timeslotInfo,
  children,
  additionalTeachers,
}: ResourceCardTooltipProps) {
  if (
    !timeslotInfo &&
    (!Array.isArray(additionalTeachers) || additionalTeachers.length === 0)
  ) {
    return children;
  }

  return (
    <LightTooltip
      title={
        <ResourceCardTooltipContent
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
