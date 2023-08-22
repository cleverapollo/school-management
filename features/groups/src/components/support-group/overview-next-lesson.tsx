import { Box, Typography } from '@mui/material';
import { useTranslation } from '@tyro/i18n';
import { CalendarEventAttendeeType, Staff } from '@tyro/api';

import { usePreferredNameLayout } from '@tyro/core';
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
    rooms = [],
    startTime = '',
    endTime = '',
    attendees = [],
  } = nextLessonData || {};

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
      ].map(({ label, value }) => (
        <Fragment key={label}>
          <Typography
            component="dt"
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
            gridRow={2}
            sx={{
              ...textValueStyle,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'blue.50',
              '&:first-of-type': {
                borderRadius: '17px 0 0 17px',
              },
              '&:last-of-type': {
                borderRadius: '0 17px 17px 0',
              },
            }}
          >
            {value}
          </Typography>
        </Fragment>
      ))}
    </Box>
  );
}
