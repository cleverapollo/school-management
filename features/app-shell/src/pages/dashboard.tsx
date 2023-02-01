import { Container, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function Dashboard() {
  const { t } = useTranslation(['common']);

  return (
    <Page title={t('common:dashboard')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('common:dashboard')}
        </Typography>
      </Container>
    </Page>
  );
}
