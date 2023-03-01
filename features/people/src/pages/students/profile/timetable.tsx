import { useParams } from 'react-router-dom';
import * as React from 'react';
import { Container } from '@mui/material';
import { Calendar } from '@tyro/calendar';

export default function StudentProfileTimetablePage() {
  const { id } = useParams();

  return (
    <Container maxWidth="xl">
      <Calendar partyId={id as number | undefined} />
    </Container>
  );
}
