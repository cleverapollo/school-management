import {
  Box,
  Card,
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
  alpha,
} from '@mui/material';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FullScreenIcon,
  SwapHorizontalIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link, useNavigate } from 'react-router-dom';
import { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  CalendarEventAttendeeType,
  CalendarGridPeriodType,
  Calendar_TagContext,
  DayType,
  usePermissions,
  useUser,
} from '@tyro/api';
import {
  DateDropdownPicker,
  getClassesFromObject,
  LoadingPlaceholderContainer,
} from '@tyro/core';
import { usePartyTimetable } from '../../api/timetable';
import { useTimetableInPeriods } from '../../hooks/use-timetable-in-periods';

dayjs.extend(LocalizedFormat);
dayjs.extend(calendar);

interface TimetableWidgetProps {
  partyId: number | undefined;
  heading?: string;
  to?: string;
  showTeacher?: boolean;
  useNavBar?: boolean;
}

function TimetableNonSchoolState({
  schoolDayType = DayType.Holiday,
}: {
  schoolDayType?: DayType.Holiday | DayType.StaffDay;
}) {
  const { t } = useTranslation(['calendar']);

  return (
    <Stack
      sx={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h2" component="span">
        🌤
      </Typography>
      <Typography variant="body1" component="span" color="text.secondary">
        {t(`calendar:dayType.${schoolDayType}`)}
      </Typography>
    </Stack>
  );
}

export function TimetableWidget({
  partyId,
  heading,
  to = '/calendar',
  showTeacher = true,
  useNavBar = false,
}: TimetableWidgetProps) {
  const { t } = useTranslation(['common', 'assessments', 'calendar']);
  const { activeProfile } = useUser();
  const { isStaffUser } = usePermissions();
  const [date, setDate] = useState(dayjs());
  const { data, isLoading } = usePartyTimetable({ partyId, date });
  const dayInfo = useTimetableInPeriods(date, data);
  const navigate = useNavigate();

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
        mb={1}
      >
        <Typography variant="h6" component="span">
          {heading ?? t('calendar:inputLabels.schedule')}
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          {!useNavBar && (
            <DateDropdownPicker
              date={date}
              onChangeDate={setDate}
              ButtonProps={{
                size: 'small',
              }}
            />
          )}
          <IconButton component={Link} to={to}>
            <FullScreenIcon
              sx={{ width: 20, height: 20, color: 'primary.main' }}
            />
          </IconButton>
        </Stack>
      </Stack>
      {useNavBar && (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 1,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <IconButton
            size="small"
            color="primary"
            aria-label={t('common:actions.previous')}
            onClick={() => setDate(date.subtract(1, 'day'))}
          >
            <ChevronLeftIcon />
          </IconButton>
          <DateDropdownPicker
            date={date}
            onChangeDate={setDate}
            ButtonProps={{
              size: 'small',
            }}
          />
          <IconButton
            size="small"
            color="primary"
            aria-label={t('common:actions.next')}
            onClick={() => setDate(date.add(1, 'day'))}
          >
            <ChevronRightIcon />
          </IconButton>
        </Stack>
      )}
      <Card
        sx={{
          minHeight: 160,
        }}
      >
        <LoadingPlaceholderContainer isLoading={isLoading}>
          {dayInfo.dayType === DayType.SchoolDay ||
          dayInfo.dayType === DayType.Partial ? (
            <TableContainer>
              <Table
                size="small"
                sx={({ palette }) => ({
                  px: 0.5,
                  mb: 1,
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                  '& th, & td': {
                    px: 0.5,
                  },
                  '& td:first-of-type, & th:first-of-type': {
                    pl: 1.5,
                  },
                  '& td:last-of-type, & th:last-of-type': {
                    pr: 1.5,
                    textAlign: 'right',
                  },
                  '& th:nth-of-type(2)': {
                    pl: 4,
                  },
                  '& th, & td:last-of-type, & td:nth-of-type(2)': {
                    background: 'transparent',
                    color: 'text.primary',
                    fontWeight: 600,
                  },
                  '& th': {
                    py: 1,
                  },
                  '& td': {
                    color: 'text.secondary',
                  },
                  '& .current-period td': {
                    borderStyle: 'solid',
                    borderWidth: '2px 0',
                    borderColor: 'primary.main',
                  },
                  '& .break td': {
                    backgroundColor: alpha(palette.indigo[50], 0.3),
                  },
                  '& .break td:nth-of-type(2)': {
                    color: 'text.primary',
                  },
                  '& td:first-of-type': {
                    borderTopLeftRadius: 19,
                    borderBottomLeftRadius: 19,
                  },
                  '& td:last-of-type': {
                    borderTopRightRadius: 19,
                    borderBottomRightRadius: 19,
                  },
                  '& .current-period td:first-of-type': {
                    borderLeftWidth: 2,
                    pl: 1.25,
                  },
                  '& .current-period td:last-of-type': {
                    borderRightWidth: 2,
                    pr: 1.25,
                  },
                  '& .before-school td, & .after-school td': {
                    color: 'indigo.500',
                  },
                  '& .clickable': {
                    '&:hover td': {
                      backgroundColor: palette.indigo[50],
                    },
                    '&:active td': {
                      backgroundColor: palette.indigo[100],
                    },
                    '& td': {
                      cursor: 'pointer',
                    },
                  },
                })}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>{t('calendar:time')}</TableCell>
                    <TableCell>{t('calendar:lesson')}</TableCell>
                    {showTeacher && (
                      <TableCell>{t('common:teacher')}</TableCell>
                    )}
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
                          ? `${
                              teacher?.partyInfo?.person?.firstName?.[0] ?? ''
                            }. ${teacher?.partyInfo?.person?.lastName ?? ''}`
                          : '-';

                      const subjectAttendee = event?.attendees?.find(
                        (attendee) =>
                          attendee?.partyInfo?.__typename === 'SubjectGroup'
                      );
                      const subjectGroup =
                        subjectAttendee?.partyInfo?.__typename ===
                        'SubjectGroup'
                          ? subjectAttendee.partyInfo
                          : undefined;

                      const roomNames =
                        event?.rooms && event?.rooms?.length > 0
                          ? event.rooms.map((room) => room?.name).join(', ')
                          : '-';
                      const isCurrentClass =
                        dayjs().isBefore(endTime) && dayjs().isAfter(startTime);
                      const isSubstitution = event?.tags?.some(
                        ({ context }) =>
                          context === Calendar_TagContext.Substitution
                      );
                      const canClickToSubjectGroup =
                        !!subjectGroup?.partyId &&
                        isStaffUser &&
                        partyId === activeProfile?.partyId;

                      return (
                        <Fragment
                          key={`${startTime ?? ''}-${event?.eventId ?? ''}`}
                        >
                          <TableRow
                            onClick={
                              canClickToSubjectGroup
                                ? () =>
                                    navigate(
                                      `/groups/subject/${subjectGroup?.partyId}/attendance?eventStartTime=${startTime}`
                                    )
                                : undefined
                            }
                            className={getClassesFromObject({
                              'current-period': isCurrentClass,
                              clickable: canClickToSubjectGroup,
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
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'green.400',
                                    width: '20px',
                                    height: '20px',

                                    '& svg': {
                                      width: '18px',
                                      height: '18px',
                                      transform: 'rotate(-45deg)',
                                      '& path': {
                                        strokeWidth: 2,
                                      },
                                    },
                                  }}
                                >
                                  {isSubstitution && <SwapHorizontalIcon />}
                                </Box>
                                <Box
                                  component="span"
                                  fontWeight={isBreak ? '400' : '600'}
                                >
                                  {isBreak
                                    ? t('calendar:break')
                                    : event?.name ?? '-'}
                                </Box>
                              </Stack>
                            </TableCell>
                            {showTeacher && (
                              <TableCell>{teacherName ?? '-'}</TableCell>
                            )}
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
