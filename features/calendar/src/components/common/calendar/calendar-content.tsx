import { EventContentArg } from '@fullcalendar/core';
import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

export function getCalendarContent(eventInfo: EventContentArg) {
  switch (eventInfo.view.type) {
    case 'timeGridDay':
    case 'timeGridWeek':
    case 'resourceTimelineDay':
    case 'resourceTimeGridDay': {
      const { room, organizer, additionalTeachers } =
        eventInfo.event.extendedProps;
      const numberOfAdditionalTeachers =
        Array.isArray(additionalTeachers) && additionalTeachers?.length > 0
          ? ` +${additionalTeachers?.length}`
          : '';
      const subtitleList = [
        room ?? null,
        typeof organizer === 'string'
          ? `${organizer}${numberOfAdditionalTeachers}`
          : null,
      ];
      return (
        <Stack
          direction="row"
          sx={{ alignItems: 'stretch', height: '100%', p: '3px' }}
        >
          <Box
            sx={{
              width: 3,
              borderRadius: 1.5,
              backgroundColor: eventInfo.borderColor,
              mr: 0.5,
            }}
          />
          <Stack sx={{ overflow: 'hidden', flex: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              height={22}
              overflow="hidden"
            >
              <Typography variant="subtitle2" noWrap>
                {eventInfo.event.title}
              </Typography>
              {!eventInfo.event.allDay && (
                <Typography variant="caption" noWrap sx={{ mr: 0.5 }}>
                  {dayjs(eventInfo.event.start).format('LT')} -{' '}
                  {dayjs(eventInfo.event.end).format('LT')}
                </Typography>
              )}
            </Stack>
            <Typography variant="caption" noWrap sx={{ fontWeight: 600 }}>
              {subtitleList.filter(Boolean).join(', ')}
            </Typography>
          </Stack>
        </Stack>
      );
    }
    case 'dayGridMonth':
      return (
        <Stack direction="row" alignItems="center" px={0.5}>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: eventInfo.borderColor,
              mr: 0.5,
            }}
          />
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography variant="subtitle2" noWrap sx={{ fontSize: '0.75rem' }}>
              {eventInfo.event.title}
            </Typography>
          </Box>
        </Stack>
      );
    default:
      return (
        <>
          <Typography>{eventInfo.timeText}</Typography>
          <i>{eventInfo.event.title}</i>
        </>
      );
  }
}
