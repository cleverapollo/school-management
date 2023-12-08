import { EventContentArg } from '@fullcalendar/core';
import { Box, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { SubIcon } from '@tyro/substitution';
import { CalendarEventType } from '@tyro/api';

dayjs.extend(LocalizedFormat);

export function getCalendarContent(eventInfo: EventContentArg) {
  const {
    room,
    organizer,
    additionalTeachers,
    isSubstitution,
    originalEvent,
    backgroundImage,
  } = eventInfo.event.extendedProps;
  const { type } = originalEvent as { type: CalendarEventType };
  // const bgImage = backgroundImage as string;
  switch (eventInfo.view.type) {
    case 'timeGridDay':
    case 'timeGridWeek':
    case 'resourceTimelineDay':
    case 'resourceTimeGridDay': {
      const numberOfAdditionalTeachers =
        Array.isArray(additionalTeachers) && additionalTeachers?.length > 0
          ? ` +${additionalTeachers?.length}`
          : '';
      const subtitleList = [
        room ?? null,
        typeof organizer === 'string' && type !== CalendarEventType.General
          ? `${organizer}${numberOfAdditionalTeachers}`
          : null,
      ];
      return (
        <Stack
          direction="row"
          sx={{
            alignItems: 'stretch',
            height: '100%',
            p: '3px',
            // backgroundImage: bgImage,
            borderRadius: '5px',
          }}
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
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="subtitle2" noWrap>
                  {eventInfo.event.title}
                </Typography>
                {isSubstitution && <SubIcon />}
              </Stack>
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
        <Stack
          direction="row"
          alignItems="center"
          px={0.5}
          borderRadius="5px"
          // sx={{
          //   backgroundImage: bgImage,
          // }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: eventInfo.borderColor,
              mr: 0.5,
            }}
          />
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            overflow="hidden"
            flex={1}
          >
            <Typography variant="subtitle2" noWrap sx={{ fontSize: '0.75rem' }}>
              {eventInfo.event.title}
            </Typography>
            {isSubstitution && <SubIcon size="small" />}
          </Stack>
        </Stack>
      );
    default:
      return (
        <>
          <Typography>{eventInfo.timeText}</Typography>
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            overflow="hidden"
            flex={1}
          >
            <i>{eventInfo.event.title}</i>
            {isSubstitution && <SubIcon size="small" />}
          </Stack>
        </>
      );
  }
}
