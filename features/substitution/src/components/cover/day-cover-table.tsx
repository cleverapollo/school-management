import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DateSwitcher } from '@tyro/calendar';
import { usePreferredNameLayout } from '@tyro/core';
import { CoverTable } from './cover-table';
import { useEventsForCover } from '../../api/staff-work-events-for-cover';

export function DayCoverTable() {
  const { displayName } = usePreferredNameLayout();
  const [date, setDate] = useState(dayjs());

  const { data } = useEventsForCover({
    fromDate: date.format('YYYY-MM-DD'),
    toDate: date.format('YYYY-MM-DD'),
  });

  const periods = useMemo(() => {
    const numberOfPeriods =
      data?.reduce((acc, { substitutionEventsByDay }) => {
        console.log({
          substitutionEventsByDay,
        });
        return Math.max(
          acc,
          substitutionEventsByDay[0].substitutionEventsByPeriod.length ?? 0
        );
      }, 0) ?? 0;

    return Array.from({ length: numberOfPeriods }, (_, i) => i + 1);
  }, [data]);

  const mappedData = useMemo(
    () =>
      data?.map(({ staff, substitutionEventsByDay }) => ({
        id: String(staff.person.partyId),
        firstColumn: {
          label: displayName(staff.person),
          avatarUrl: staff.person.avatarUrl,
          linkAction: () => {},
        },
        dayInfo: substitutionEventsByDay[0].dayInfo,
        periods: substitutionEventsByDay[0].substitutionEventsByPeriod,
      })) ?? [],
    [data]
  );

  return (
    <CoverTable
      periods={periods}
      showAvatar
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
