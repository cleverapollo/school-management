import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
//
import { useState, useRef, useEffect, Fragment, useMemo } from 'react';
// @mui
import { Card, Button, Container, DialogTitle } from '@mui/material';
// redux
import { RootState, useDispatch, useTypedSelector } from '../../../store/store';
import { updateEvent } from '../../../store/slices/calendar';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useResponsive from '../../../hooks/useResponsive';
// @types
import { CalendarView } from '../types';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import { DialogAnimate } from '../../../components/animate';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// sections
import { CalendarForm, CalendarStyle, CalendarToolbar } from '.';
import { useCalendarEvents } from '../api/events'; 
import { CalendarEventFilter, Maybe } from '@tyro/api/src/gql/graphql';
import CalendarEventView from './CalendarEventView';
import { useUser } from '@tyro/api';
import { PROFILE_TYPE_NAMES } from '../../../constants';

// ----------------------------------------------------------------------


interface Range{
  start: Date;
  end: Date;
}

//ToDo: Change filter values, when create events will be done
const filter: CalendarEventFilter = {
  "startDate": "2022-01-01",
  "endDate": "2022-12-30",
  "partyIds": [610],
};


export default function Calendar() {
  const { themeStretch } = useSettings();
  const { activeProfile } = useUser();
  const profileTypeName = activeProfile?.profileType?.name;

  //ToDO: implement isEditable with permissions
  const isEditable = profileTypeName === PROFILE_TYPE_NAMES.ADMIN || profileTypeName === PROFILE_TYPE_NAMES.TEACHER;

  const dispatch = useDispatch();

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef<FullCalendar>(null);

  const [date, setDate] = useState(new Date());

  const [view, setView] = useState<CalendarView>(isDesktop ? 'dayGridMonth' : 'listWeek');

  //const { isOpenModal, selectedRange } = useTypedSelector((state) => state.calendar);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedRange, setSelectedRange] = useState<null | Range>(null);

  const { data, isLoading } = useCalendarEvents(filter);
  const newData = useMemo(() => data?.map((event,index) => ({ ...event, id: index.toString() })), [data]);

  const [selectedEventId, setSelectedEventId] = useState<Maybe<string>>(null);
  const selectedEvent = useMemo(() => {
    if (selectedEventId) {
      return newData?.find((_event) => _event.id === selectedEventId);
    }
    return null;
  }, [selectedEventId]);

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
    setIsOpenModal(true);
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    setSelectedEventId(arg.event.id);
    setIsOpenModal(true);
  };

  //ToDo: remove redux when update event will be implemented
  const handleResizeEvent = async ({ event }: EventResizeDoneArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  //ToDo: remove redux when update event will be implemented
  const handleDropEvent = async ({ event }: EventDropArg) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddEvent = () => {
    setIsOpenModal(true);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setSelectedRange(null);
    setSelectedEventId(null);
  };

  if (isLoading) {
    return <Fragment />
  }

  return (
    <Page title="Calendar">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Calendar"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Calendar' }]}
          action={
            isEditable && <Button
              variant="contained"
              startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
              onClick={handleAddEvent}
            >
              New Event
            </Button>
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
              events={newData}
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
              ]}
            />
          </CalendarStyle>
        </Card>

        <DialogAnimate open={isOpenModal} onClose={handleCloseModal} sx={{ maxWidth: '750px !important' }}>
          { 
          selectedEvent ? 
          <>
            <CalendarEventView event={selectedEvent} onCancel={handleCloseModal} isEditable={isEditable}/>
          </>
          : 
          <>
            <DialogTitle>{'Add Event'}</DialogTitle>

            <CalendarForm
              event={{}}
              range={selectedRange}
              onCancel={handleCloseModal}
            />
          </>
          }
        </DialogAnimate>
      </Container>
    </Page>
  );
}
