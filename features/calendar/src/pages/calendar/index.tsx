import { Container } from '@mui/material';
import { Page } from '@tyro/core';
import Calendar from '../../components/Calendar';

export default function CalendarPage() {
  return (
    <Page title="Calendar">
      <Container maxWidth="xl">
        <Calendar />
      </Container>
    </Page>
  );
}
