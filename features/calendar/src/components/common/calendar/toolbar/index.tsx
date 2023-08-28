import { Dispatch, RefObject, SetStateAction } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Button, Box } from '@mui/material';
import { useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AddIcon, EditCalendarIcon } from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import FullCalendar from '@fullcalendar/react';
import { usePermissions } from '@tyro/api';
import { CalendarView } from '../../../../types';
import { CalendarViewSwitcher } from './view-switcher';
import { DateSwitcher } from './date-switcher';

dayjs.extend(LocalizedFormat);

const RootStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2.5),
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

interface CalendarToolbarProps {
  calendarRef: RefObject<FullCalendar>;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  view: CalendarView;
  onEditCalendar: VoidFunction;
  onAddEvent: VoidFunction;
  onChangeView: (newView: CalendarView) => void;
  hasMultipleResources?: boolean;
}

export function CalendarToolbar({
  calendarRef,
  date,
  setDate,
  view,
  onEditCalendar,
  onAddEvent,
  onChangeView,
  hasMultipleResources = true,
}: CalendarToolbarProps) {
  const isDesktop = useResponsive('up', 'sm');
  const { t } = useTranslation(['calendar']);
  const currentDate = dayjs(date);
  const { isTyroUser } = usePermissions();
  const onPreviousDateClick = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const onNextDateClick = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  const onChangeDate = (newDate: dayjs.Dayjs) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.gotoDate(newDate.toDate());
      setDate(calendarApi.getDate());
    }
  };

  return (
    <RootStyle>
      {isDesktop && (
        <CalendarViewSwitcher
          value={view}
          onChange={onChangeView}
          hasMultipleResources={hasMultipleResources}
        />
      )}

      <DateSwitcher
        onPreviousDateClick={onPreviousDateClick}
        onNextDateClick={onNextDateClick}
        date={currentDate}
        onChangeDate={onChangeDate}
      />

      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          color="primary"
          variant="text"
          onClick={onEditCalendar}
          startIcon={<EditCalendarIcon sx={{ width: 20, height: 20 }} />}
        >
          {t('calendar:filterCalendar')}
        </Button>
        {
          // leaving as tyro user for now as it is less disoverable when you have to click on the calendar to add an event. We can revisit once we get a bit of testing done on it
          isTyroUser && (
            <Button
              size="small"
              color="primary"
              variant="text"
              onClick={onAddEvent}
              sx={{
                '& .MuiButton-startIcon': {
                  mr: 0.25,
                },
              }}
              startIcon={<AddIcon sx={{ width: 24, height: 24 }} />}
            >
              {t('calendar:addEvent')}
            </Button>
          )
        }
      </Stack>
    </RootStyle>
  );
}
