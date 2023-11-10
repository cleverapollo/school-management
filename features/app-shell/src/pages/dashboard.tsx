import { Box, Container, Stack, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AWOLWidget } from '@tyro/reporting';
import { TimetableWidget } from '@tyro/calendar';
import { useUser } from '@tyro/api';

export default function Dashboard() {
  const { t } = useTranslation(['navigation']);
  const { activeProfile } = useUser();

  return (
    <Page title={t('navigation:general.dashboard')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('navigation:general.dashboard')}
        </Typography>
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <Box flex={1} minWidth="380px" maxWidth="420px">
            <AWOLWidget />
          </Box>
          <Box flex={1} minWidth="380px" maxWidth="420px" />
          <Box flex={1} minWidth="380px" maxWidth="420px">
            <TimetableWidget partyId={activeProfile?.partyId ?? 0} />
          </Box>
        </Stack>
      </Container>
    </Page>
  );
}
