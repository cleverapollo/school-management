import { Box, Container, Stack, Typography } from '@mui/material';
import { MasonryGrid, Page } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { AWOLWidget, BehaviourWidget } from '@tyro/reporting';
import { TimetableWidget } from '@tyro/calendar';
import { usePermissions, useUser } from '@tyro/api';

export default function Dashboard() {
  const { t } = useTranslation(['navigation']);
  const { activeProfile } = useUser();
  const { isStaffUserWithPermission } = usePermissions();

  return (
    <Page title={t('navigation:general.dashboard')}>
      <Container maxWidth="xl">
        <Typography variant="h3" component="h1" paragraph>
          {t('navigation:general.dashboard')}
        </Typography>
        <MasonryGrid
          gridItems={[
            <AWOLWidget />,
            isStaffUserWithPermission('ps:1:notes:read_behaviour') && (
              <BehaviourWidget />
            ),
            <TimetableWidget
              showTeacher={false}
              partyId={activeProfile?.partyId ?? 0}
            />,
          ]}
        />
      </Container>
    </Page>
  );
}
