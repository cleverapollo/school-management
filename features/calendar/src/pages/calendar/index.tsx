import { Container, Typography } from '@mui/material';
import { Page } from '@tyro/core';
import { usePermissions, useUser, SearchType } from '@tyro/api';
import { useTranslation } from '@tyro/i18n';
import { useMemo } from 'react';
import { Calendar } from '../../components/common/calendar/calendar';

export default function CalendarPage() {
  const { t } = useTranslation(['navigation', 'calendar']);
  const { activeProfile } = useUser();
  const { isStaffUser, isContact } = usePermissions();

  const userSearchType = useMemo(() => {
    if (isStaffUser) {
      return SearchType.Staff;
    }

    if (isContact) {
      return SearchType.Contact;
    }

    return SearchType.Student;
  }, [isStaffUser, isContact]);

  const defaultPartys = useMemo(
    () =>
      activeProfile?.partyId
        ? [
            {
              partyId: activeProfile.partyId,
              text: activeProfile.nickName ?? '',
              type: userSearchType,
              avatarUrl: activeProfile.avatarUrl,
            },
          ]
        : [],
    [activeProfile, userSearchType]
  );

  return (
    <Page title={t('calendar:calendar')}>
      <Container maxWidth={false} sx={{ maxWidth: 1980 }}>
        <Typography variant="h3" component="h1" paragraph>
          {t('calendar:calendar')}
        </Typography>
        <Calendar defaultPartys={defaultPartys} />
      </Container>
    </Page>
  );
}
