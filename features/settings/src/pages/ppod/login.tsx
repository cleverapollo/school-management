import { Page, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { Container } from '@mui/material';

import PpodLogin from '../../components/ppod/ppod-login';

export default function Login() {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <Page title={t('settings:ppodCredentials')}>
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <PageHeading
          title={t('settings:ppodCredentials')}
          titleProps={{ variant: 'h3' }}
        />
        <PpodLogin />
      </Container>
    </Page>
  );
}
