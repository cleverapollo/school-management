import { Box, Stack } from '@mui/material';
import { getNumber, useBreakpointValue } from '@tyro/core';
import { StudentAssessmentWidget } from '@tyro/assessments';
import { useParams } from 'react-router-dom';
import { TimetableWidget } from '@tyro/calendar';
import { usePermissions } from '@tyro/api';
import { StudentSessionAttendanceChart } from '../../../components/students/student-session-attendance-chart';
import { StudentContactsWidget } from '../../../components/students/student-contacts-widget';

export default function StudentProfileOverviewPage() {
  const { id } = useParams();
  const studentId = getNumber(id);
  const direction = useBreakpointValue<'row' | 'column'>({
    base: 'column',
    md: 'row',
  });

  const { hasPermission } = usePermissions();
  // return (
  //   <Stack direction={direction} spacing={3}>
  //     <StudentContactsWidget studentId={studentId} />
  //     <TimetableWidget
  //       partyId={studentId}
  //       heading="Student's timetable"
  //       to="../timetable"
  //     />
  //   </Stack>
  // );

  // Hide till we have data for all widgets
  return (
    <Box
      sx={(theme) => ({
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
      {hasPermission('ps:1:people:view_contacts_for_student') && (
        <Box
          sx={{
            gridColumn: 'span 2',
            gridRow: 'span 1',
          }}
        >
          <StudentContactsWidget studentId={studentId} />
        </Box>
      )}
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
        {/* temporarily hiding the session attendance chart for all user types from student overview page until it's fixed */}
        {/* <StudentSessionAttendanceChart studentId={studentId} /> */}
      </Box>
    </Box>
  );
}
