import { useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import { Calendar } from '@tyro/calendar';
import { useNumber } from '@tyro/core';

export default function StudentProfileTimetablePage() {
  const { id } = useParams();
  const studentId = useNumber(id);
  return (
    <Container maxWidth="xl">
      <Calendar partyId={studentId} />
    </Container>
  );
}
