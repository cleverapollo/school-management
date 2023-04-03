import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function ManagementContainer() {
  const { t } = useTranslation(['substitution']);

  const substitutionTitle = t('substitution:management');

  return (
    <Page title={substitutionTitle}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          pb: 3,
        }}
      >
        <Outlet />
      </Container>
    </Page>
  );
}
