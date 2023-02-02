import { Container, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { PeoplesTable } from '../../components/peoples-table';

export default function AdminPeoplesPage() {
  const { t } = useTranslation(['admin']);
  return (
    <Page title={t('admin:people')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('admin:people')}
        </Typography>
        <PeoplesTable />
      </Container>
    </Page>
  );
}
