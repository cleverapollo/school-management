import { Dispatch, RefObject, SetStateAction, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { Stack, Button, IconButton, Box, Popover } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useDisclosure, useResponsive } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  AddIcon,
  EditCalendarIcon,
} from '@tyro/icons';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import FullCalendar from '@fullcalendar/react';
import { CalendarView } from '../../../../types';
import { CalendarViewSwitcher } from './view-switcher';

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
  const dateButtonRef = useRef<HTMLButtonElement>(null);
  const { getButtonProps, getDisclosureProps } = useDisclosure();
  const currentDate = dayjs(date);

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

      <Stack direction="row" alignItems="center" spacing={2}>
        <IconButton onClick={onPreviousDateClick}>
          <ChevronLeftIcon />
        </IconButton>

        <Button
          ref={dateButtonRef}
          variant="text"
          color="inherit"
          sx={{ fontWeight: 600 }}
          {...getButtonProps()}
        >
          {currentDate.format('LL')}
        </Button>
        <Popover
          {...getDisclosureProps()}
          anchorEl={dateButtonRef.current}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              value={currentDate}
              onChange={(newValue) => {
                if (newValue) {
                  onChangeDate(newValue);
                }
              }}
            />
          </LocalizationProvider>
        </Popover>

        <IconButton onClick={onNextDateClick}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>

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
        {/* <Button */}
        {/*  size="small" */}
        {/*  color="primary" */}
        {/*  variant="text" */}
        {/*  onClick={onAddEvent} */}
        {/*  sx={{ */}
        {/*    '& .MuiButton-startIcon': { */}
        {/*      mr: 0.25, */}
        {/*    }, */}
        {/*  }} */}
        {/*  startIcon={<AddIcon sx={{ width: 24, height: 24 }} />} */}
        {/* > */}
        {/*  {t('calendar:addEvent')} */}
        {/* </Button> */}
      </Stack>
    </RootStyle>
  );
}
