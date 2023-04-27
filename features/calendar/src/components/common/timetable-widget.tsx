import {
  Box,
  Card,
  CardHeader,
  IconButton,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  TableContainer,
  Divider,
} from '@mui/material';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  CalendarEventAttendeeType,
  CalendarGridPeriodType,
  SchoolDayType,
} from '@tyro/api';
import { getClassesFromObject, usePreferredNameLayout } from '@tyro/core';
import { usePartyTimetable } from '../../api/timetable';
import { useTimetableInPeriods } from '../../hooks/use-timetable-in-periods';

dayjs.extend(LocalizedFormat);
dayjs.extend(calendar);

interface TimetableWidgetProps {
  partyId: number | undefined;
  heading: string;
  to?: string;
}

function TimetableNonSchoolState({
  schoolDayType,
}: {
  schoolDayType: SchoolDayType.NonSchoolDay | SchoolDayType.PublicHoliday;
}) {
  const { t } = useTranslation(['calendar']);

  return (
    <Box
      sx={{
        minHeight: 300,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" component="span">
        {t(`calendar:schoolDayType.${schoolDayType}`)}
      </Typography>
    </Box>
  );
}

export function TimetableWidget({
  partyId,
  heading,
  to,
}: TimetableWidgetProps) {
  const { t } = useTranslation(['common', 'assessments', 'calendar']);
  const [date, setDate] = useState(dayjs());
  const { data } = usePartyTimetable({ partyId, date });
  const dayInfo = useTimetableInPeriods(date, data);
  const { displayName } = usePreferredNameLayout();

  const formattedDate = date.calendar(null, {
    sameDay: `[${t('calendar:today')}]`,
    nextDay: `[${t('calendar:tomorrow')}]`,
    nextWeek: 'dddd',
    lastDay: `[${t('calendar:yesterday')}]`,
    lastWeek: `[${t('calendar:dayOfLastWeek', { day: date.format('dddd') })}]`,
    sameElse: 'l',
  });

  return (
    <Card variant="outlined" sx={{ height: '100%', flex: 1, pb: 2 }}>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          pl: 3,
          pr: 2,
          pt: 2.25,
          pb: 1.25,
        }}
      >
        <CardHeader component="h3" title={heading} sx={{ p: 0, m: 0 }} />
        {to && (
          <IconButton component={Link} to={to}>
            <ExternalLinkIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        )}
      </Stack>
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderWidth: '1px 0',
          borderStyle: 'solid',
          borderColor: 'divider',
        }}
      >
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setDate(date.subtract(1, 'day'));
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Box sx={{ flex: 1, overflowX: 'hidden' }}>
          <Typography
            component="h4"
            variant="subtitle2"
            noWrap
            sx={{ px: 2, textOverflow: 'ellipsis', textAlign: 'center' }}
          >
            {formattedDate}
          </Typography>
        </Box>
        <IconButton
          size="small"
          color="primary"
          onClick={() => {
            setDate(date.add(1, 'day'));
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Stack>
      {dayInfo.dayType !== SchoolDayType.PublicHoliday &&
      dayInfo.dayType !== SchoolDayType.NonSchoolDay ? (
        <TableContainer>
          <Table
            size="small"
            sx={{
              mt: 1,
              px: 1.5,
              borderCollapse: 'separate',
              borderSpacing: 0,
              '& td:first-of-type, & th:first-of-type': {
                pl: 1.5,
              },
              '& td:last-of-type, & th:last-of-type': {
                pr: 1.5,
                textAlign: 'right',
              },
              '& th, & td:last-of-type': {
                background: 'transparent',
                color: 'text.primary',
                fontWeight: 700,
              },
              '& th': {
                py: 2,
              },
              '& td': {
                color: 'text.secondary',
              },
              '& .current-period td': {
                borderStyle: 'solid',
                borderWidth: '1px 0',
                borderColor: 'primary.main',
              },
              '& .break td': {
                backgroundColor: 'indigo.50',
              },
              '& .break td:nth-of-type(2)': {
                color: 'text.primary',
              },
              '& .current-period td:first-of-type, & .break td:first-of-type': {
                borderTopLeftRadius: 17,
                borderBottomLeftRadius: 17,
              },
              '& .current-period td:last-of-type, & .break td:last-of-type': {
                borderTopRightRadius: 17,
                borderBottomRightRadius: 17,
              },
              '& .current-period td:first-of-type': {
                borderLeftWidth: 1,
              },
              '& .current-period td:last-of-type': {
                borderRightWidth: 1,
              },
              '& .before-school td, & .after-school td': {
                color: 'indigo.500',
              },
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>{t('calendar:time')}</TableCell>
                <TableCell>{t('calendar:lesson')}</TableCell>
                <TableCell>{t('common:teacher')}</TableCell>
                <TableCell>{t('calendar:room')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dayInfo.periods?.map(
                ({ startTime, endTime, type, event }, index) => {
                  const isBreak = type === CalendarGridPeriodType.Break;
                  const isBeforeSchoolStart = dayjs(startTime).isBefore(
                    dayInfo.startTime
                  );
                  const isAfterSchoolEnd = dayjs(startTime).isAfter(
                    dayInfo.endTime
                  );
                  const isLastEventBeforeSchoolStart =
                    dayInfo.numberOfEventsBeforeSchool > 0 &&
                    index === dayInfo.numberOfEventsBeforeSchool - 1;
                  const isLastEventBeforeSchoolEnd =
                    dayInfo.numberOfEventsAfterSchool > 0 &&
                    index ===
                      dayInfo.periods.length -
                        dayInfo.numberOfEventsAfterSchool -
                        1;
                  const teacher = event?.attendees?.find(
                    (attendee) =>
                      attendee.type === CalendarEventAttendeeType.Organiser
                  );
                  const teacherName =
                    teacher?.partyInfo?.__typename === 'Staff'
                      ? displayName(teacher.partyInfo.person)
                      : '-';

                  const subject = event?.attendees?.find(
                    (attendee) =>
                      attendee?.partyInfo?.__typename === 'SubjectGroup'
                  );
                  const subjectName =
                    subject?.partyInfo?.__typename === 'SubjectGroup'
                      ? subject.partyInfo.name
                      : '-';

                  const roomNames =
                    event?.rooms?.map((room) => room?.name).join(', ') ?? '-';
                  const isCurrentClass =
                    dayjs().isBefore(endTime) && dayjs().isAfter(startTime);

                  return (
                    <Fragment
                      key={`${startTime ?? ''}-${event?.eventId ?? ''}`}
                    >
                      <TableRow
                        className={getClassesFromObject({
                          'current-period': isCurrentClass,
                          break: isBreak,
                          'before-school': isBeforeSchoolStart,
                          'after-school': isAfterSchoolEnd,
                          last:
                            isLastEventBeforeSchoolStart ||
                            isLastEventBeforeSchoolEnd,
                        })}
                      >
                        <TableCell>{dayjs(startTime).format('H:mm')}</TableCell>
                        <TableCell>
                          {isBreak ? t('calendar:break') : subjectName}
                        </TableCell>
                        <TableCell>{teacherName}</TableCell>
                        <TableCell>{roomNames}</TableCell>
                      </TableRow>
                      {(isLastEventBeforeSchoolEnd ||
                        isLastEventBeforeSchoolStart) && (
                        <TableRow
                          key={`${startTime ?? ''}-${
                            event?.eventId ?? ''
                          }-divider`}
                          aria-hidden
                        >
                          <TableCell colSpan={4}>
                            <Divider
                              sx={{
                                borderStyle: 'dashed',
                                borderColor: 'divider',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                }
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TimetableNonSchoolState schoolDayType={dayInfo.dayType} />
      )}
    </Card>
  );
}
