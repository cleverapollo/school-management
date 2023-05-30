import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, CalendarParty } from '@tyro/calendar';
import { useNumber, usePreferredNameLayout } from '@tyro/core';
import { CalendarEventAttendeeType, SearchType } from '@tyro/api';
import { useStudent } from '../../../api/student/students';

export default function StudentProfileTimetablePage() {
  const { id } = useParams();
  const studentId = useNumber(id);
  const { displayName } = usePreferredNameLayout();

  const { data } = useStudent(studentId);

  const defaultPartys = useMemo<CalendarParty[]>(
    () =>
      data?.partyId
        ? [
            {
              partyId: data?.partyId,
              text: displayName(data?.person),
              type: SearchType.Student,
              avatarUrl: data?.person?.avatarUrl,
              attendeeType: CalendarEventAttendeeType.Attendee,
            },
          ]
        : [],
    [data, displayName]
  );

  return <Calendar defaultPartys={defaultPartys} />;
}
