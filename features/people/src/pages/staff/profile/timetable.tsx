import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, CalendarParty } from '@tyro/calendar';
import { useNumber, usePreferredNameLayout } from '@tyro/core';
import { CalendarEventAttendeeType, SearchType } from '@tyro/api';
import { useStaffForSelect } from '../../../api/staff';

export default function StaffProfileTimetablePage() {
  const { id } = useParams();
  const staffId = useNumber(id);

  const { displayName } = usePreferredNameLayout();

  const { data: staffData = [] } = useStaffForSelect({
    partyIds: [staffId ?? 0],
  });

  const defaultPartys = useMemo<CalendarParty[]>(
    () =>
      staffData.map((staff) => ({
        partyId: staff.partyId,
        text: displayName(staff),
        type: SearchType.Staff,
        avatarUrl: staff.avatarUrl,
        attendeeType: CalendarEventAttendeeType.Attendee,
      })),
    [staffData, displayName]
  );

  return <Calendar defaultPartys={defaultPartys} />;
}
