import { useMemo } from 'react';
import { Dayjs } from 'dayjs';
import { DateSwitcher } from '@tyro/calendar';
import { StaffSelectOption } from '@tyro/people';
import { usePreferredNameLayout } from '@tyro/core';
import { CoverTable } from './cover-table';
import { useEventsForCover } from '../../api/staff-work-events-for-cover';

interface DayCoverTableProps {
  goToStaffMembersView: (staff: StaffSelectOption) => void;
  date: Dayjs;
  setDate: (date: Dayjs) => void;
}

export function DayCoverTable({
  goToStaffMembersView,
  date,
  setDate,
}: DayCoverTableProps) {
  const { sortByDisplayName } = usePreferredNameLayout();
  const { data, isLoading } = useEventsForCover({
    fromDate: date.format('YYYY-MM-DD'),
    toDate: date.format('YYYY-MM-DD'),
  });

  const mappedData = useMemo(
    () =>
      data?.map(({ staff, substitutionEventsByDay }) => ({
        staff: staff.person,
        dayInfo: substitutionEventsByDay[0].dayInfo,
        requireSubstitutionReason:
          substitutionEventsByDay[0].requireSubstitutionReason,
        periods: substitutionEventsByDay[0].substitutionEventsByPeriod,
      })) ?? [],
    [data, sortByDisplayName]
  );

  return (
    <CoverTable
      userAsFirstColumn
      onLinkClick={(staff) => goToStaffMembersView(staff)}
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
