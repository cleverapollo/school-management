import {
  Stack,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  styled,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  getLocaleTimestampFromDateString,
  usePreferredNameLayout,
} from '@tyro/core';
import { LayersIcon } from '@tyro/icons';
import {
  getCurrentCoverRoom,
  getAdditionalStaff,
} from '../../../utils/cover-utils';
import { CoverEvent } from '../../../hooks/use-cover-table';
import { ReturnTypeFromUseEventsForCover } from '../../../api/staff-work-events-for-cover';
import { SubIcon } from '../../common/sub-icon';

interface CoverCardTooltipProps {
  eventInfo: CoverEvent;
  children: React.ReactElement;
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
}

interface CoverCardTooltipProps {
  eventInfo: CoverEvent;
  children: React.ReactElement;
  staff: ReturnTypeFromUseEventsForCover[number]['staff']['person'];
}

interface BreakTooltipProps {
  children: React.ReactElement;
  timeslotInfo: { startTime: string; endTime: string } | null;
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

export function CoverCardTooltipContent({
  eventInfo,
  staff,
}: Pick<CoverCardTooltipProps, 'eventInfo' | 'staff'>) {
  const { t } = useTranslation(['common', 'substitution']);
  const { displayName, displayNames } = usePreferredNameLayout();
  const { event, substitution, coverTeacherDuplicatedAtSameTime } = eventInfo;
  const { substituteStaff } = substitution ?? {};
  const hasSubstitute = !!substituteStaff;
  const hasDuplicateSubstitute = Boolean(
    coverTeacherDuplicatedAtSameTime &&
      coverTeacherDuplicatedAtSameTime?.length > 0
  );

  const rooms = getCurrentCoverRoom(eventInfo);
  const additionalTeachers = getAdditionalStaff(eventInfo);

  return (
    <Stack px={0.5}>
      {hasDuplicateSubstitute && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pt={1}
        >
          <Stack direction="row" alignItems="center" spacing={0.25}>
            <LayersIcon />
            <Typography variant="subtitle1">
              {(coverTeacherDuplicatedAtSameTime?.length ?? 0) + 1}
            </Typography>
          </Stack>
          <Typography variant="subtitle1" fontWeight={700}>
            {t('substitution:duplicateSubstitutes')}
          </Typography>
          <SubIcon size="large" />
        </Stack>
      )}
      {hasSubstitute && !hasDuplicateSubstitute && (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pt={1}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            {t('substitution:substitute')}
          </Typography>
          <SubIcon size="large" />
        </Stack>
      )}
      <Table
        size="small"
        sx={({ palette }) => ({
          px: 0.5,
          borderSpacing: 0,
          '& th, & td': {
            px: 1,
          },
          '& th': {
            background: 'transparent',
            color: 'text.secondary',
            fontWeight: 500,
            borderBottom: `1px dashed ${palette.indigo[200]}`,
            pb: 0.5,
          },
          '& td': {
            py: 0.5,
          },
          '& th:first-of-type, & td:first-of-type': {
            pl: 0,
          },
          '& th:last-of-type, & td:last-of-type': {
            pr: 0,
            textAlign: 'right',
          },
          '& td:first-of-type': {
            color: palette.blue[500],
          },
        })}
      >
        <TableHead>
          <TableRow>
            <TableCell component="th">{t('common:time')}</TableCell>
            <TableCell component="th">{t('common:subject')}</TableCell>
            <TableCell component="th">{t('common:teachers')}</TableCell>
            <TableCell component="th">
              {t('common:room', { count: 1 })}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              {`${getLocaleTimestampFromDateString(
                event.startTime
              )} - ${getLocaleTimestampFromDateString(event.endTime)}`}
            </TableCell>
            <TableCell>{event.name}</TableCell>
            <TableCell>
              {displayName(substituteStaff ?? staff)}
              {additionalTeachers.length > 0
                ? `, ${displayNames(additionalTeachers)}`
                : ''}
            </TableCell>
            <TableCell>{rooms || '-'}</TableCell>
          </TableRow>
          {coverTeacherDuplicatedAtSameTime?.map((duplicateEventInfo) => {
            const { event: duplicateEvent } = duplicateEventInfo;
            const duplicateRooms = getCurrentCoverRoom(duplicateEventInfo);
            const duplicateAdditionalTeachers =
              getAdditionalStaff(duplicateEventInfo);

            return (
              <TableRow>
                <TableCell>
                  {`${getLocaleTimestampFromDateString(
                    duplicateEvent.startTime
                  )} - ${getLocaleTimestampFromDateString(
                    duplicateEvent.endTime
                  )}`}
                </TableCell>
                <TableCell>{duplicateEvent.name}</TableCell>
                <TableCell>
                  {displayName(substituteStaff)}
                  {additionalTeachers.length > 0
                    ? `, ${displayNames(duplicateAdditionalTeachers)}`
                    : ''}
                </TableCell>
                <TableCell>{duplicateRooms || '-'}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Stack>
  );
}

function BreakCardTooltipContent({
  timeslotInfo,
}: Pick<BreakTooltipProps, 'timeslotInfo'>) {
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
            {`${getLocaleTimestampFromDateString(
              timeslotInfo.startTime
            )} - ${getLocaleTimestampFromDateString(timeslotInfo.endTime)}`}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

export function CoverCardTooltip({
  eventInfo,
  staff,
  children,
}: CoverCardTooltipProps) {
  return (
    <LightTooltip
      title={<CoverCardTooltipContent staff={staff} eventInfo={eventInfo} />}
      describeChild
      enterDelay={1000}
      enterNextDelay={1000}
      placement="right"
      sx={{
        '& .MuiTooltip-tooltip': {
          maxWidth: 'md',
        },
      }}
    >
      {children}
    </LightTooltip>
  );
}

export function BreakCardTooltip({
  children,
  timeslotInfo,
}: BreakTooltipProps) {
  return (
    <LightTooltip
      title={<BreakCardTooltipContent timeslotInfo={timeslotInfo} />}
      describeChild
      enterDelay={1000}
      enterNextDelay={1000}
      placement="right"
    >
      {children}
    </LightTooltip>
  );
}
