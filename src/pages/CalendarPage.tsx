// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../hooks/useSettings';
// components
import Page from '../components/Page';
import Calendar from '../features/calendar/Calendar';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Page Six">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Calendar />
      </Container>
    </Page>
  );
}
