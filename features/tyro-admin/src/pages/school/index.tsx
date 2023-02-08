import { Container, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SchoolsTable } from '../../components/schools-table';

// ----------------------------------------------------------------------

export default function AdminSchoolsPage() {
  const { t } = useTranslation(['admin']);
  return (
    <Page title={t('admin:schools')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('admin:schools')}
        </Typography>
        <SchoolsTable />
      </Container>
    </Page>
  );
}
