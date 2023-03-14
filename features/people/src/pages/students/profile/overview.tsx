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
      sx={(theme) => ({
        my: 3,
        display: 'grid',
        gap: 3,
        maxWidth: 'xl',
        gridTemplateRows: 'repeat(4, auto)',
        gridTemplateColumns: 'repeat(2, 1fr)',
        [theme.breakpoints.up('md')]: {
          gridTemplateRows: 'repeat(3, auto)',
          gridTemplateColumns: 'repeat(4, 1fr)',
        },
        [theme.breakpoints.up('xl')]: {
          gridTemplateRows: 'repeat(2, auto)',
          gridTemplateColumns: 'repeat(7, 1fr)',
        },
      })}
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
        sx={(theme) => ({
          gridColumn: 'span 2',
          gridRow: 'span 1',
          [theme.breakpoints.up('md')]: {
            gridColumn: 'span 4',
            gridRow: 'span 1',
          },
          [theme.breakpoints.up('xl')]: {
            gridColumn: 'span 3',
            gridRow: 'span 2',
          },
        })}
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
        sx={(theme) => ({
          gridColumn: 'span 2',
          gridRow: 'span 1',
          [theme.breakpoints.up('md')]: {
            gridColumn: 'span 4',
            gridRow: 'span 1',
          },
        })}
      >
        <StudentSessionAttendanceChart studentId={studentId} />
      </Box>
    </Box>
  );
}
