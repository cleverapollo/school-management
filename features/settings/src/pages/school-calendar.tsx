import { useTranslation } from '@tyro/i18n';
import { Page } from '@tyro/core';
import { Container, Typography } from '@mui/material';

import { CalendarOverview } from '../components/school-calendar/overview';

export default function SchoolCalendarOverview() {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <Page title={t('settings:schoolCalendar.title')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('settings:schoolCalendar.title')}
        </Typography>
        <CalendarOverview />
      </Container>
    </Page>
  );
}
