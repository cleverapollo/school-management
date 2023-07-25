import dayjs, { Dayjs } from 'dayjs';
import { useState, useMemo } from 'react';
import { useEventsForCover } from '../../api/staff-work-events-for-cover';
import { CoverTable } from './cover-table';
import { DateRangeSwitcher } from './date-range-switcher';

export function StaffCoverTable({
  staffPartyId,
}: {
  staffPartyId: number | undefined;
}) {
  const [date, setDate] = useState<[Dayjs, Dayjs]>([
    dayjs(),
    dayjs().add(3, 'month'),
  ]);
  const [fromDate, toDate] = date;

  const { data, isLoading } = useEventsForCover(
    {
      staffPartyIds: staffPartyId ? [staffPartyId] : undefined,
      fromDate: fromDate.format('YYYY-MM-DD'),
      toDate: toDate.format('YYYY-MM-DD'),
    },
    staffPartyId !== undefined
  );

  const mappedData = useMemo(
    () =>
      data?.flatMap(({ staff, substitutionEventsByDay }) =>
        substitutionEventsByDay.map(
          ({ dayInfo, substitutionEventsByPeriod }) => ({
            staff: staff.person,
            dayInfo,
            periods: substitutionEventsByPeriod,
          })
        )
      ) ?? [],
    [data]
  );

  return (
    <CoverTable
      isLoading={isLoading}
      datepicker={
        <DateRangeSwitcher
          dateRange={date}
          onChangeRange={(newDate) => setDate(newDate)}
        />
      }
      data={mappedData}
    />
  );
}
