import { Box, Container, Stack, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AWOLWidget } from '@tyro/reporting';

export default function Dashboard() {
  const { t } = useTranslation(['navigation']);

  return (
    <Page title={t('navigation:general.dashboard')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('navigation:general.dashboard')}
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Box flex={1} minWidth="380px" maxWidth="420px">
            <AWOLWidget />
          </Box>
          <Box flex={1} minWidth="380px" maxWidth="420px" />
          <Box flex={1} minWidth="380px" maxWidth="420px" />
        </Stack>
      </Container>
    </Page>
  );
}
