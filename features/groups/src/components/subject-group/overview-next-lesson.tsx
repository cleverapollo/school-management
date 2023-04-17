import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import {
  AttendanceCodeType,
  CalendarEventAttendeeType,
  Staff,
} from '@tyro/api';

import { usePreferredNameLayout, CurrentAttendanceIcon } from '@tyro/core';
import { Fragment } from 'react';
import { useNextSubjectGroupLesson } from '../../api';
import { useFormatLessonTime } from '../../hooks';

interface SubjectGroupOverviewNextLessonProps {
  groupId: number;
}

export function SubjectGroupOverviewNextLesson({
  groupId,
}: SubjectGroupOverviewNextLessonProps) {
  const { t } = useTranslation(['groups', 'attendance', 'common']);

  const { displayNames } = usePreferredNameLayout();

  const { data: nextLessonData } = useNextSubjectGroupLesson({
    partyId: groupId,
  });

  const {
    eventId,
    rooms = [],
    startTime = '',
    endTime = '',
    attendees = [],
    extensions,
  } = nextLessonData || {};
  const eventAttendance = extensions?.eventAttendance || [];

  const hasTakenAttendance = eventAttendance && eventAttendance?.length > 0;

  const roomsNames = rooms.map(({ name }) => name).join(', ');

  const organisers = attendees
    .filter(({ type }) => type === CalendarEventAttendeeType.Organiser)
    .map(({ partyInfo }) => (partyInfo as Staff)?.person);

  const nextLessonTeachers = displayNames(organisers);

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
              tooltipText={
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
