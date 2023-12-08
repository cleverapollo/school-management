import { Dayjs } from 'dayjs';
import { useState, useMemo, useEffect } from 'react';
import { useEventsForCover } from '../../api/staff-work-events-for-cover';
import { CoverTable } from './cover-table';
import { DateRangeSwitcher } from './date-range-switcher';

interface StaffCoverTableProps {
  goToDateOnDayView: (date: Dayjs) => void;
  staffPartyId: number | undefined;
  date: Dayjs;
  setDate: (date: Dayjs) => void;
}

export function StaffCoverTable({
  goToDateOnDayView,
  staffPartyId,
  date,
  setDate,
}: StaffCoverTableProps) {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    date,
    date.add(3, 'month'),
  ]);
  const [fromDate, toDate] = dateRange;

  const { data, isFetching } = useEventsForCover(
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
          ({
            dayInfo,
            substitutionEventsByPeriod,
            requireSubstitutionReason,
          }) => ({
            staff: staff.person,
            dayInfo,
            requireSubstitutionReason,
            periods: substitutionEventsByPeriod,
          })
        )
      ) ?? [],
    [data]
  );

  useEffect(() => {
    if (!date.isSame(fromDate, 'day')) {
      setDate(fromDate);
    }
  }, [fromDate]);

  return (
    <CoverTable
      isLoading={isFetching}
      onLinkClick={(_staff, newDate) => goToDateOnDayView(newDate)}
      datepicker={
        <DateRangeSwitcher dateRange={dateRange} onChangeRange={setDateRange} />
      }
      data={mappedData}
    />
  );
}
