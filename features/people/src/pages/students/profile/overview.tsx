import { Stack } from '@mui/material';
import { getNumber } from '@tyro/core';
import { useParams } from 'react-router-dom';
import { StudentContactsWidget } from '../../../components/students/student-contacts-widget';

export default function StudentProfileOverviewPage() {
  const { id } = useParams();
  const studentId = getNumber(id);

  return (
    <Stack my={3} spacing={3}>
      <StudentContactsWidget studentId={studentId} />
    </Stack>
  );
}
