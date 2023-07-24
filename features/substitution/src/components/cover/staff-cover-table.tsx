import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import { CoverTable } from './cover-table';
import { DateRangeSwitcher } from './date-range-switcher';

export function StaffCoverTable() {
  const [date, setDate] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs().add(3, 'month'),
  ]);

  const periods = [1, 2, 3, 4, 5, 6, 7, 9];

  return (
    <CoverTable
      periods={periods}
      datepicker={
        <DateRangeSwitcher
          dateRange={date}
          onChangeRange={(newDate) => setDate(newDate)}
        />
      }
    />
  );
}
