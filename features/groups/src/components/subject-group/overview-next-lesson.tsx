import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  AttendanceCodeType,
  CalendarEventAttendeeType,
  Iterator,
  Staff,
} from '@tyro/api';

import { usePreferredNameLayout, CurrentAttendanceIcon } from '@tyro/core';
import { Fragment } from 'react';
import { useSubjectGroupLessonByIterator } from '../../api';
import { useFormatLessonTime } from '../../hooks';

interface SubjectGroupOverviewNextLessonProps {
  groupId: number;
}

export function SubjectGroupOverviewNextLesson({
  groupId,
}: SubjectGroupOverviewNextLessonProps) {
  const { t } = useTranslation(['groups', 'attendance', 'common']);

  const { displayName } = usePreferredNameLayout();

  const { data: closestLessonData } = useSubjectGroupLessonByIterator({
    partyId: groupId,
    iterator: Iterator.Closest,
  });

  const { data: nextLessonData } = useSubjectGroupLessonByIterator({
    partyId: groupId,
    iterator: Iterator.Next,
    eventStartTime: closestLessonData?.startTime,
  });

  const {
    eventId,
    rooms = [],
    startTime,
    endTime,
    attendees = [],
    eventAttendance = [],
  } = nextLessonData || {};

  const hasTakenAttendance = eventAttendance && eventAttendance?.length > 0;

  const roomsNames = rooms.map(({ name }) => name).join(', ');

  const nextLessonTeachers = attendees
    .filter(({ type }) => type === CalendarEventAttendeeType.Organiser)
    .map(({ partyInfo }) => displayName((partyInfo as Staff).person))
    .join(', ');

  const formattedDate = useFormatLessonTime({ startTime, endTime });

  const labelStyle = {
    fontSize: '0.75rem',
    color: 'slate.600',
    px: 2,
    py: 0.5,
  };

  const textValueStyle = {
    fontSize: '0.75rem',
    px: 2,
    py: 0.5,
  };

  return (
    <Box
      component="dl"
      display="grid"
      gridTemplateColumns="repeat(4, auto)"
      gridTemplateRows="repeat(2, auto)"
      sx={{ m: 0 }}
    >
      {[
        {
          label: t('groups:nextLesson'),
          value: formattedDate,
        },
        {
          label: t('groups:room'),
          value: roomsNames || '-',
        },
        {
          label: t('common:teacher'),
          value: nextLessonTeachers || '-',
        },
        {
          label: t('common:attendance'),
          value: eventId ? (
            <CurrentAttendanceIcon
              codeType={
                hasTakenAttendance
                  ? AttendanceCodeType.Present
                  : AttendanceCodeType.NotTaken
              }
              name={
                hasTakenAttendance
                  ? t('attendance:attendanceTaken')
                  : t('attendance:attendanceNotTaken')
              }
            />
          ) : (
            '-'
          ),
        },
      ].map(({ label, value }, index) => (
        <Fragment key={label}>
          <Typography
            component="dt"
            gridColumn={(index % 4) + 1}
            gridRow={1}
            textTransform="capitalize"
            sx={{
              ...labelStyle,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {label}
          </Typography>
          <Typography
            component="dd"
            gridColumn={(index % 4) + 1}
            gridRow={2}
            sx={{
              ...textValueStyle,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'blue.50',
              ...(index === 0 && {
                borderRadius: '17px 0 0 17px',
              }),
              ...(index === 3 && {
                borderRadius: '0 17px 17px 0',
                justifyContent: 'center',
              }),
            }}
          >
            {value}
          </Typography>
        </Fragment>
      ))}
    </Box>
  );
}
