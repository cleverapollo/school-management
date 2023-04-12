import { DayHeaderContentArg } from '@fullcalendar/core';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

export function getDayHeaderContent(arg: DayHeaderContentArg) {
  const dayDate = dayjs(arg.date);
  const isToday = dayDate.isSame(dayjs(), 'day');

  if (arg.view.type === 'timeGridWeek') {
    return (
      <Box className={isToday ? 'today' : undefined} component="span">
        {dayDate.format('ddd')}{' '}
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 32,
            height: 32,
            borderRadius: '50%',
            ml: 1,
            backgroundColor: isToday ? 'indigo.500' : 'indigo.100',
            color: isToday ? 'white' : 'indigo.500',
          }}
        >
          {dayDate.format('D')}
        </Box>
      </Box>
    );
  }

  return (
    <Box className={isToday ? 'today' : undefined} component="span">
      {arg.text}
    </Box>
  );
}
