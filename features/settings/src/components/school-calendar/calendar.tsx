import { Dispatch, SetStateAction, useRef, useMemo, useCallback } from 'react';
import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import { AcademicNamespace, CalendarDayInfo, DayType } from '@tyro/api';
import { wasMultiSelectKeyUsed } from '@tyro/core';
import { MonthCalendar } from './month-calendar';

dayjs.extend(isToday);

type SchoolCalendarProps = {
  bellTimes: CalendarDayInfo[];
  activeAcademicNamespace?: AcademicNamespace;
  dayTypeFilter: DayType | 'All';
  selectedDays: string[];
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
};

export const SchoolCalendar = ({
  bellTimes,
  activeAcademicNamespace,
  dayTypeFilter,
  selectedDays,
  setSelectedDays,
}: SchoolCalendarProps) => {
  const lastSelectedDate = useRef<string | null>(null);

  const monthsValues = useMemo(() => {
    const startDate = dayjs(activeAcademicNamespace?.startDate);
    const endDate = dayjs(activeAcademicNamespace?.endDate);
    const months = [];

    const diffInMonths = endDate.diff(startDate, 'month');
    const totalMonths = diffInMonths + 1;

    for (let i = 0; i <= totalMonths; i += 1) {
      months.push(startDate.add(i, 'month').format('YYYY-MM-DD'));
    }

    return months;
  }, [activeAcademicNamespace]);

  const filteredBellTimes = useMemo(
    () =>
      dayTypeFilter === 'All'
        ? bellTimes
        : bellTimes.filter((bellTime) => bellTime.dayType === dayTypeFilter),
    [dayTypeFilter, bellTimes]
  );

  const handleSelectDay = useCallback(
    (event: React.MouseEvent, day: CalendarDayInfo) => {
      if (wasMultiSelectKeyUsed(event) && lastSelectedDate.current !== null) {
        const from = dayjs(day.date)?.isBefore(lastSelectedDate.current)
          ? day.date
          : lastSelectedDate.current;
        const to = dayjs(day.date)?.isAfter(lastSelectedDate.current)
          ? day.date
          : lastSelectedDate.current;

        const dateRange = Array.from(
          { length: dayjs(to).diff(from, 'day') + 1 },
          (_, index) => dayjs(from).add(index, 'day').format('YYYY-MM-DD')
        ).filter((d) => dayjs(d).day() !== 0 && dayjs(d).day() !== 6);
        setSelectedDays((prev) => Array.from(new Set([...prev, ...dateRange])));
      } else if (selectedDays.find((date) => date === day.date)) {
        setSelectedDays((prev) => prev.filter((d) => d !== day.date));
      } else {
        setSelectedDays((prev) => [...prev, day.date]);
      }

      lastSelectedDate.current = day.date;
    },
    [setSelectedDays]
  );

  return (
    <Stack
      flexDirection={{ xs: 'column', sm: 'row' }}
      flexWrap={{ xs: 'nowrap', sm: 'wrap' }}
      justifyContent={{ xs: 'center', sm: 'space-evenly' }}
      gap={2}
    >
      {monthsValues.map((month) => (
        <MonthCalendar
          key={month}
          month={month}
          handleSelectDay={handleSelectDay}
          selectedDays={selectedDays}
          bellTimes={filteredBellTimes}
        />
      ))}
    </Stack>
  );
};
