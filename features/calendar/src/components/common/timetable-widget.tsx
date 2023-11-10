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
  FullScreenIcon,
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
import {
  getClassesFromObject,
  LoadingPlaceholderContainer,
  usePreferredNameLayout,
} from '@tyro/core';
import { usePartyTimetable } from '../../api/timetable';
import { useTimetableInPeriods } from '../../hooks/use-timetable-in-periods';

dayjs.extend(LocalizedFormat);
dayjs.extend(calendar);

interface TimetableWidgetProps {
  partyId: number | undefined;
  heading?: string;
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
  to = '/calendar',
}: TimetableWidgetProps) {
  const { t } = useTranslation(['common', 'assessments', 'calendar']);
  const [date, setDate] = useState(dayjs());
  const { data, isLoading } = usePartyTimetable({ partyId, date });
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
    <Card
      variant="soft"
      sx={{
        flex: 1,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        pl={1}
        mb={0.5}
      >
        <Typography variant="h6" component="span">
          {heading ?? t('calendar:inputLabels.schedule')}
        </Typography>
        <IconButton component={Link} to={to}>
          <FullScreenIcon
            sx={{ width: 20, height: 20, color: 'primary.main' }}
          />
        </IconButton>
      </Stack>
      <Card
        sx={{
          minHeight: 128,
        }}
      >
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {dayInfo.dayType !== SchoolDayType.PublicHoliday &&
          dayInfo.dayType !== SchoolDayType.NonSchoolDay ? (
            <TableContainer>
              <Table
                size="small"
                sx={{
                  px: 0.5,
                  mb: 1.5,
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
                    py: 1,
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
                  '& .current-period td:first-of-type, & .break td:first-of-type':
                    {
                      borderTopLeftRadius: 17,
                      borderBottomLeftRadius: 17,
                    },
                  '& .current-period td:last-of-type, & .break td:last-of-type':
                    {
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
                        event?.rooms?.map((room) => room?.name).join(', ') ??
                        '-';
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
                            <TableCell>
                              {dayjs(startTime).format('H:mm')}
                            </TableCell>
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
        </LoadingPlaceholderContainer>
      </Card>
    </Card>
  );
}
