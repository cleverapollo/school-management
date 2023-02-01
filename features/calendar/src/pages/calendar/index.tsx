import { Container } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import Calendar from '../../components/Calendar';

export default function CalendarPage() {
  const { t } = useTranslation(['calendar']);
  return (
    <Page title={t('calendar:calendar')}>
      <Container maxWidth="xl">
        <Calendar />
      </Container>
    </Page>
  );
}
