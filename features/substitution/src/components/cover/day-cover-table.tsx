import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DateSwitcher } from '@tyro/calendar';
import { CoverTable } from './cover-table';
import { useEventsForCover } from '../../api/staff-work-events-for-cover';

export function DayCoverTable() {
  const [date, setDate] = useState(dayjs());

  const { data, isLoading } = useEventsForCover({
    fromDate: date.format('YYYY-MM-DD'),
    toDate: date.format('YYYY-MM-DD'),
  });

  const mappedData = useMemo(
    () =>
      data?.map(({ staff, substitutionEventsByDay }) => ({
        staff: staff.person,
        dayInfo: substitutionEventsByDay[0].dayInfo,
        periods: substitutionEventsByDay[0].substitutionEventsByPeriod,
      })) ?? [],
    [data]
  );

  return (
    <CoverTable
      userAsFirstColumn
      onLinkClick={(staff) => console.log(staff)}
      isLoading={isLoading}
      datepicker={
        <DateSwitcher
          date={date}
          onChangeDate={setDate}
          onNextDateClick={() => setDate(date.add(1, 'day'))}
          onPreviousDateClick={() => setDate(date.subtract(1, 'day'))}
        />
      }
      data={mappedData}
    />
  );
}
