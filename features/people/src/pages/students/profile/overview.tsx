import { Box } from '@mui/material';
import { getNumber } from '@tyro/core';
import { StudentAssessmentWidget } from '@tyro/assessment';
import { useParams } from 'react-router-dom';
import { TimetableWidget } from '@tyro/calendar';
import { StudentSessionAttendanceChart } from '../../../components/students/student-session-attendance-chart';
import { StudentContactsWidget } from '../../../components/students/student-contacts-widget';

export default function StudentProfileOverviewPage() {
  const { id } = useParams();
  const studentId = getNumber(id);

  return (
    <Box
      sx={{
        my: 3,
        display: 'grid',
        gridTemplateRows: 'repeat(2, auto)',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 3,
        maxWidth: 'xl',
      }}
    >
      <Box
        sx={{
          gridColumn: 'span 2',
          gridRow: 'span 1',
        }}
      >
        <StudentContactsWidget studentId={studentId} />
      </Box>
      <Box
        sx={{
          gridColumn: 'span 2',
          gridRow: 'span 1',
        }}
      >
        <StudentAssessmentWidget studentId={studentId} />
      </Box>
      <Box
        sx={{
          gridColumn: 'span 3',
          gridRow: 'span 2',
        }}
      >
        <Box>
          <TimetableWidget
            partyId={studentId}
            heading="Student's timetable"
            to="../timetable"
          />
        </Box>
      </Box>
      <Box
        sx={{
          gridColumn: 'span 4',
          gridRow: 'span 1',
        }}
      >
        <StudentSessionAttendanceChart studentId={studentId} />
      </Box>
    </Box>
  );
}
