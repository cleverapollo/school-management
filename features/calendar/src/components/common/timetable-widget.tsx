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
} from '@mui/material';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
} from '@tyro/icons';
import { useTranslation } from '@tyro/i18n';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { CalendarEventAttendeeType } from '@tyro/api';
import { usePreferredNameLayout } from '@tyro/core';
import { usePartyTimetable } from '../../api/timetable';

dayjs.extend(LocalizedFormat);
dayjs.extend(calendar);

interface TimetableWidgetProps {
  partyId: number | undefined;
  heading: string;
  to?: string;
}

export function TimetableWidget({
  partyId,
  heading,
  to,
}: TimetableWidgetProps) {
  const { t } = useTranslation(['common', 'assessment', 'calendar']);
  const [date, setDate] = useState(dayjs());
  const { data } = usePartyTimetable({ partyId, date });
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
    <Card variant="outlined" sx={{ height: '100%', flex: 1 }}>
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
          '& .current-period td:first-of-type': {
            borderLeftWidth: 1,
            borderTopLeftRadius: 17,
            borderBottomLeftRadius: 17,
          },
          '& .current-period td:last-of-type': {
            borderRightWidth: 1,
            borderTopRightRadius: 17,
            borderBottomRightRadius: 17,
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
          {data?.map((lesson) => {
            const teacher = lesson?.attendees?.find(
              (attendee) =>
                attendee.type === CalendarEventAttendeeType.Organiser
            );
            const teacherName =
              teacher?.partyInfo?.__typename === 'Staff'
                ? displayName(teacher.partyInfo.person)
                : '-';

            const subject = lesson?.attendees?.find(
              (attendee) => attendee?.partyInfo?.__typename === 'SubjectGroup'
            );
            const subjectName =
              subject?.partyInfo?.__typename === 'SubjectGroup'
                ? subject.partyInfo.name
                : '-';

            const roomNames =
              lesson?.rooms?.map((room) => room?.name).join(', ') ?? '-';
            const isCurrentClass =
              dayjs().isBefore(lesson?.endTime) &&
              dayjs().isAfter(lesson?.startTime);

            return (
              <TableRow
                className={isCurrentClass ? 'current-period' : undefined}
                key={lesson?.eventId}
              >
                <TableCell>{dayjs(lesson?.startTime).format('H:mm')}</TableCell>
                <TableCell>{subjectName}</TableCell>
                <TableCell>{teacherName}</TableCell>
                <TableCell>{roomNames}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
