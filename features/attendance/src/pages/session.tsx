import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useState } from 'react';
import { Stack } from '@mui/material';
import { SessionAttendanceSearch } from '../components/session/session-attendance-search';
import { SessionParty } from '../hooks/use-session-party-search-props';
import { SessionAttendanceRoleBook } from '../components/role-book/session-role-book';

export default function SessionAttendance() {
  const { t } = useTranslation(['attendance', 'navigation']);
  const [selectedPartys, setSelectedPartys] = useState<SessionParty[]>([]);

  return (
    <PageContainer
      title={t('attendance:sessionAttendance')}
      maxWidth={false}
      sx={{ maxWidth: 1980 }}
    >
      <PageHeading
        title={t('attendance:sessionAttendance')}
        titleProps={{ variant: 'h3' }}
      />
      <Stack>
        <SessionAttendanceSearch
          selectedPartys={selectedPartys}
          onChangeSelectedPartys={setSelectedPartys}
        />
      </Stack>
      <SessionAttendanceRoleBook
        partyIds={selectedPartys.map((party) => party.partyId)}
      />
    </PageContainer>
  );
}
