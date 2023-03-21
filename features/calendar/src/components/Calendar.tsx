/* eslint-disable import/no-relative-packages */
// TODO: remove above eslint when components are moved to @tyro/core
import FullCalendar from '@fullcalendar/react';
import { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin, {
  EventResizeDoneArg,
} from '@fullcalendar/interaction';
//
import { useState, useRef, useEffect, useMemo } from 'react';
// @mui
import { Card, Button, Container } from '@mui/material';
// routes
import {
  Maybe,
  CalendarEventFilter,
  usePermissions,
  UserType,
} from '@tyro/api';
import { useResponsive, Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
// @types
import { CalendarView } from '../types';
// components
import { Iconify } from '../../../../src/components/iconify';
import HeaderBreadcrumbs from '../../../../src/components/HeaderBreadcrumbs';
// sections
import { CalendarForm, CalendarStyle, CalendarToolbar } from '.';
import { useCalendarEvents, useUpdateCalendarEvents } from '../api/events';
import CalendarEventView from './CalendarEventView';

// ----------------------------------------------------------------------

interface Range {
  start: Date;
  end: Date;
}

// ToDo: Change filter values, when create events will be done
export const filter: CalendarEventFilter = {
  startDate: '2022-09-05',
  endDate: '2023-03-07',
  partyIds: [1780],
};

export interface CalendarProps {
  partyId: number | undefined;
  startDate?: Date;
  endDate?: Date;
}

export const Calendar = function Calendar({
  partyId,
  startDate,
  endDate,
}: CalendarProps) {
  const { userType } = usePermissions();

  const { t } = useTranslation(['calendar', 'common', 'navigation']);

  // ToDO: implement isEditable with permissions
  const isEditable =
    userType === UserType.Admin || userType === UserType.Teacher;

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef<FullCalendar>(null);

  const [date, setDate] = useState(new Date());

  const [view, setView] = useState<CalendarView>(
    isDesktop ? 'dayGridMonth' : 'listWeek'
  );

  const [isNewEventOpenModal, setIsNewEventOpenModal] =
    useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<null | Range>(null);

  const { data, isLoading } = useCalendarEvents({
    startDate: '2022-09-05',
    endDate: '2023-03-07',
    partyIds: [partyId || 1780],
  });

  const [selectedEventId, setSelectedEventId] = useState<Maybe<string>>(null);
  const selectedEvent = useMemo(() => {
    if (selectedEventId) {
      return data?.find((_event) => _event.id === selectedEventId);
    }
    return null;
  }, [selectedEventId]);

  const { mutate: updateCalendarEvent } = useUpdateCalendarEvents();

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const handleSelectRange = (arg: DateSelectArg) => {
    const { start, end } = arg;
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }
    setSelectedRange({ start, end });
    setIsNewEventOpenModal(true);
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    setSelectedEventId(arg.event.id);
    setIsNewEventOpenModal(true);
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
    setIsNewEventOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsNewEventOpenModal(false);
    setSelectedRange(null);
    setSelectedEventId(null);
  };

  if (isLoading) {
    return null;
  }

  return (
    <Page title={t('calendar:calendar')}>
      <Container maxWidth="xl">
        <HeaderBreadcrumbs
          heading={t('calendar:calendar')}
          links={[
            {
              name: `${t('navigation:general.dashboard')}`,
              href: '/dashboard',
            },
            { name: `${t('calendar:calendar')}` },
          ]}
          action={
            isEditable && (
              <Button
                variant="contained"
                startIcon={
                  <Iconify icon="eva:plus-fill" width={20} height={20} />
                }
                onClick={handleAddEvent}
              >
                {t('common:actions.newEvent')}
              </Button>
            )
          }
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              editable={isEditable}
              droppable={isEditable}
              selectable={isEditable}
              events={data}
              resources={[
                {
                  id: '0',
                  title: 'All',
                },
              ]}
              ref={calendarRef}
              rerenderDelay={10}
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
              height={isDesktop ? 720 : 'auto'}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
                resourceTimelinePlugin,
              ]}
              schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
            />
          </CalendarStyle>
        </Card>
        <CalendarEventView
          event={selectedEvent}
          onCancel={handleCloseModal}
          isEditable={isEditable}
        />
        <CalendarForm
          event={{}}
          range={selectedRange}
          onCancel={handleCloseModal}
          isOpenModal={isNewEventOpenModal}
        />
      </Container>
    </Page>
  );
};
