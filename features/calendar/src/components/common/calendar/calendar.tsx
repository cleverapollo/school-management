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
import { useAppShellConfig } from '@tyro/app-shell';
import { CalendarView } from '../../../types';
// sections
import { CalendarStyle, CalendarToolbar } from '.';
import {
  DEFAULT_CALENDAR_TIMES,
  useCalendarEvents,
  useUpdateCalendarEvents,
} from '../../../api/events';
import {
  CalendarEditEventDetailsModal,
  CalendarEventViewProps,
} from './edit-event-details-modal';
import { getCalendarContent } from './calendar-content';
import { FilterCalendarPanel } from './filter-calendar-panel';
import { CalendarDetailsPopover } from './details-popover';
import { getDayHeaderContent } from './day-header-content';
import { CalendarParty } from '../../../hooks/use-calendar-search-props';
import {
  DEFAULT_END_TIME,
  SELECTABLE_EVENT_CONSTRAINT,
} from './edit-event-details-modal/constants';

export interface CalendarProps {
  defaultPartys?: CalendarParty[];
  defaultDate?: Date;
  editable?: boolean;
}

export const Calendar = function Calendar({
  defaultPartys = [],
  defaultDate = dayjs().startOf('week').toDate(),
  editable,
}: CalendarProps) {
  const { userType } = usePermissions();
  const { isNavExpanded } = useAppShellConfig();
  const [selectedPartys, setSelectedPartys] = useState(defaultPartys);
  const [visableEventTypes, setVisableEventTypes] = useState<
    CalendarEventType[]
  >(Object.values(CalendarEventType));

  // ToDO: implement isEditable with permissions
  const isEditable = editable ?? false;
  const calendarRef = useRef<FullCalendar>(null);
  const [date, setDate] = useState(defaultDate);

  const isDesktop = useResponsive('up', 'sm');
  const [view, setView] = useState<CalendarView>(
    isDesktop ? 'timeGridWeek' : 'listWeek'
  );

  const {
    isOpen: isFilterCalendarOpen,
    onClose: onCloseFilterCalendar,
    onToggle: onToggleFilterCalendar,
  } = useDisclosure();
  const [editEventInitialState, setEditEventInitialState] =
    useState<CalendarEventViewProps['initialEventState']>(null);
  const [selectedEventElement, setSelectedEventElement] =
    useState<HTMLElement | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { data } = useCalendarEvents(
    {
      date,
      resources: {
        partyIds: selectedPartys.map((party) => party.partyId),
      },
    },
    visableEventTypes
  );

  const weekHours = useMemo(() => {
    const currentDate = dayjs(date).startOf('week').format('YYYY-MM-DD');
    return data?.weekHours.get(currentDate);
  }, [data?.weekHours, date]);

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
    const { start, end, allDay } = arg;
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }

    setEditEventInitialState({
      startDate: dayjs(start),
      allDayEvent: allDay,
      startTime: dayjs(start),
      endTime: dayjs(end),
      participants: defaultPartys.filter(
        (participant) => participant.attendeeType
      ),
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
      startDate: dayjs(),
      startTime: dayjs(),
      endTime: dayjs().add(DEFAULT_END_TIME, 'minutes'),
      participants: defaultPartys.filter(
        (participant) => participant.attendeeType
      ),
    });
  };

  const handleCloseEditModal = () => {
    setEditEventInitialState(null);
  };

  useEffect(() => {
    setSelectedPartys(defaultPartys);
  }, [setSelectedPartys, defaultPartys]);

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
  }, [isFilterCalendarOpen, isNavExpanded]);

  return (
    <>
      <Card>
        <CalendarStyle>
          <CalendarToolbar
            calendarRef={calendarRef}
            date={date}
            setDate={setDate}
            view={view}
            onEditCalendar={onToggleFilterCalendar}
            onAddEvent={handleAddEvent}
            onChangeView={handleChangeView}
            hasMultipleResources={data && data.numberOfResources > 1}
          />
          <Stack direction="row" alignItems="stretch">
            <FilterCalendarPanel
              isOpen={isFilterCalendarOpen}
              selectedPartys={selectedPartys}
              onChangeSelectedPartys={setSelectedPartys}
              visableEventTypes={visableEventTypes}
              setVisableEventTypes={setVisableEventTypes}
            />
            <Box sx={{ flex: 1, position: 'relative' }}>
              <FullCalendar
                weekends={false} // Update this to come from school settings when available
                allDaySlot={false}
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
                height="auto"
                selectConstraint={SELECTABLE_EVENT_CONSTRAINT}
                slotMinTime={
                  weekHours?.slotMinTime ?? DEFAULT_CALENDAR_TIMES.start
                }
                slotMaxTime={
                  weekHours?.slotMaxTime ?? DEFAULT_CALENDAR_TIMES.end
                }
                businessHours={weekHours?.businessHours}
                nowIndicator
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
                  weekHours?.businessHours && weekHours.businessHours.length > 0
                    ? weekHours.businessHours[0].startTime
                    : DEFAULT_CALENDAR_TIMES.start
                }
                schedulerLicenseKey={
                  process.env.FULL_CALENDAR_KEY ??
                  'CC-Attribution-NonCommercial-NoDerivatives'
                }
              />
              <Fade in={isFilterCalendarOpen}>
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
                    zIndex: 5,
                  }}
                  onClick={onCloseFilterCalendar}
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
        onEdit={setEditEventInitialState}
        event={selectedEvent}
      />

      <CalendarEditEventDetailsModal
        initialEventState={editEventInitialState}
        onClose={handleCloseEditModal}
      />
    </>
  );
};
