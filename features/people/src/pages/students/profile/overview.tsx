import { Box, Stack } from '@mui/material';
import { getNumber, MasonryGrid, useBreakpointValue } from '@tyro/core';
import { StudentAssessmentWidget } from '@tyro/assessments';
import { useParams } from 'react-router-dom';
import { TimetableWidget } from '@tyro/calendar';
import { usePermissions } from '@tyro/api';
import { StudentSessionAttendanceChart } from '../../../components/students/student-session-attendance-chart';
import { StudentContactsWidget } from '../../../components/students/student-contacts-widget';

export default function StudentProfileOverviewPage() {
  const { id } = useParams();
  const studentId = getNumber(id);

  const { hasPermission } = usePermissions();

  return (
    <MasonryGrid
      gridItems={[
        hasPermission('ps:1:people:view_contacts_for_student') && (
          <StudentContactsWidget studentId={studentId} />
        ),
        <StudentAssessmentWidget studentId={studentId} />,
        <TimetableWidget
          partyId={studentId}
          useNavBar
          heading="Student's timetable"
          to="../timetable"
        />,
      ]}
    />
  );
}
