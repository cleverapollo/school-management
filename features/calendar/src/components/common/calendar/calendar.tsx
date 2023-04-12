/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
//
import { useState, useRef, useEffect, useMemo } from 'react';
// @mui
import { Box, Card, Fade, IconButton, Stack } from '@mui/material';
// routes
import { usePermissions, UserType, CalendarEventType } from '@tyro/api';
import { useResponsive, useDisclosure } from '@tyro/core';
import { ChevronLeftIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import { CalendarView } from '../../../types';
// sections
import { CalendarStyle, CalendarToolbar } from '.';
import {
  useCalendarEvents,
  useUpdateCalendarEvents,
} from '../../../api/events';
import {
  CalendarEditEventDetailsModal,
  CalendarEditEventFormState,
} from './edit-event-details-modal';
import { getCalendarContent } from './calendar-content';
import { EditCalendarPanel, CalendarParty } from './edit-calendar-panel';
import { CalendarDetailsPopover } from './details-popover';
import { getDayHeaderContent } from './day-header-content';

export interface CalendarProps {
  defaultPartys?: CalendarParty[];
  defaultDate?: Date;
}

export const Calendar = function Calendar({
  defaultPartys = [],
  defaultDate = dayjs().startOf('week').toDate(),
}: CalendarProps) {
  const { userType } = usePermissions();
  const [selectedPartys, setSelectedPartys] = useState(defaultPartys);
  const [visableEventTypes, setVisableEventTypes] = useState<
    CalendarEventType[]
  >(Object.values(CalendarEventType));

  // ToDO: implement isEditable with permissions
  const isEditable =
    userType === UserType.Admin || userType === UserType.Teacher;
  const calendarRef = useRef<FullCalendar>(null);
  const [date, setDate] = useState(defaultDate);

  const isDesktop = useResponsive('up', 'sm');
  const [view, setView] = useState<CalendarView>(
    isDesktop ? 'timeGridWeek' : 'listWeek'
  );

  const {
    isOpen: isEditCalendarOpen,
    onClose: onCloseEditCalendar,
    onToggle: onToggleEditCalendar,
  } = useDisclosure();
  const [editEventInitialState, setEditEventInitialState] =
    useState<Partial<CalendarEditEventFormState> | null>(null);
  const [selectedEventElement, setSelectedEventElement] =
    useState<HTMLElement | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { data } = useCalendarEvents(
    {
      date,
      partyIds: selectedPartys.map((party) => party.partyId),
    },
    visableEventTypes
  );

  const businessHours = useMemo(() => {
    const currentDate = dayjs(date).startOf('week').format('YYYY-MM-DD');
    return data?.businessHours.get(currentDate);
  }, [data?.businessHours, date]);

  const selectedEvent = useMemo(() => {
    if (selectedEventId) {
      return data?.events?.find((_event) => _event.id === selectedEventId);
    }
  }, [selectedEventId]);

  const { mutate: updateCalendarEvent } = useUpdateCalendarEvents();

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const { start, end } = arg;
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    setEditEventInitialState({
      start: dayjs(start),
      end: dayjs(end),
    });
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    setSelectedEventElement(arg.el);
    setSelectedEventId(arg.event.id);
  };

  const handleResizeEvent = ({ event }: EventResizeDoneArg) => {
    try {
      updateCalendarEvent({
        id: event.id,
        allDay: event.allDay,
        start: event.start,
        end: event.end,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDropEvent = ({ event }: EventDropArg) => {
    try {
      updateCalendarEvent({
        id: event.id,
        allDay: event.allDay,
        start: event.start,
        end: event.end,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    setEditEventInitialState({
      start: dayjs(),
      end: dayjs().add(30, 'minutes'),
    });
  };

  const handleCloseEditModal = () => {
    setEditEventInitialState(null);
  };

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'timeGridWeek' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  useEffect(() => {
    // Needed to refresh the calendar after edit calendar panel is open/closed
    const resizeTimeout = setTimeout(() => {
      if (calendarRef.current) {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        calendarRef.current.calendar.updateSize();
      }
    }, 300);

    return () => clearTimeout(resizeTimeout);
  }, [isEditCalendarOpen]);

  return (
    <>
      <Card>
        <CalendarStyle>
          <CalendarToolbar
            calendarRef={calendarRef}
            date={date}
            setDate={setDate}
            view={view}
            onEditCalendar={onToggleEditCalendar}
            onAddEvent={handleAddEvent}
            onChangeView={handleChangeView}
            hasMultipleResources={data && data.numberOfResources > 1}
          />
          <Stack direction="row" alignItems="stretch">
            <EditCalendarPanel
              isOpen={isEditCalendarOpen}
              selectedPartys={selectedPartys}
              onChangeSelectedPartys={setSelectedPartys}
              visableEventTypes={visableEventTypes}
              setVisableEventTypes={setVisableEventTypes}
            />
            <Box sx={{ flex: 1, position: 'relative' }}>
              <FullCalendar
                weekends={false} // Update this to come from school settings when available
                editable={isEditable}
                droppable={isEditable}
                selectable={isEditable}
                events={data?.events || []}
                resources={data?.resources || []}
                ref={calendarRef}
                firstDay={1}
                rerenderDelay={10}
                eventContent={getCalendarContent}
                initialDate={date}
                initialView={view}
                dayMaxEventRows={3}
                eventDisplay="block"
                headerToolbar={false}
                allDayMaintainDuration
                eventResizableFromStart
                select={handleSelectRange}
                eventDrop={handleDropEvent}
                eventClick={handleSelectEvent}
                eventResize={handleResizeEvent}
                eventMinHeight={48}
                slotEventOverlap={false}
                height={isDesktop ? 720 : 'auto'}
                businessHours={businessHours}
                plugins={[
                  listPlugin,
                  dayGridPlugin,
                  timelinePlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  resourceTimelinePlugin,
                  resourceTimeGridPlugin,
                ]}
                dayHeaderContent={getDayHeaderContent}
                resourceAreaWidth={200}
                scrollTime={
                  Array.isArray(businessHours) && businessHours.length > 0
                    ? businessHours[0].startTime
                    : '08:00:00'
                }
                schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
              />
              <Fade in={isEditCalendarOpen}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: -13,
                    top: 12,
                    borderRadius: '50%',
                    padding: 0,
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                    backdropFilter: 'blur(6px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                  }}
                  onClick={onCloseEditCalendar}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Fade>
            </Box>
          </Stack>
        </CalendarStyle>
      </Card>

      <CalendarDetailsPopover
        eventElementRef={selectedEventElement}
        onClose={() => {
          setSelectedEventElement(null);
        }}
        onEdit={() => console.log('edit')}
        event={selectedEvent}
      />

      <CalendarEditEventDetailsModal
        initialEventState={editEventInitialState}
        onCancel={handleCloseEditModal}
      />
    </>
  );
};
