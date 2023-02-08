import { Stack } from '@mui/material';
import { getNumber } from '@tyro/core';
import { StudentAssessmentWidget } from '@tyro/assessment';
import { useParams } from 'react-router-dom';
import { StudentContactsWidget } from '../../../components/students/student-contacts-widget';

export default function StudentProfileOverviewPage() {
  const { id } = useParams();
  const studentId = getNumber(id);

  return (
    <Stack direction="row" my={3} spacing={3}>
      <StudentContactsWidget studentId={studentId} />
      <StudentAssessmentWidget studentId={studentId} />
    </Stack>
  );
}
