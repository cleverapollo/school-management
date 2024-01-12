import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useUser } from '@tyro/api';
import { StudentFeesTable } from '../components/common/student-fees-table';

export default function ContactDashboard() {
  const { t } = useTranslation(['common', 'fees', 'navigation']);
  const { activeProfile } = useUser();

  return (
    <PageContainer title={t('navigation:general.fees')}>
      <PageHeading
        title={t('navigation:general.fees')}
        titleProps={{ variant: 'h3' }}
      />
      <StudentFeesTable filter={{ contactPartyId: activeProfile?.partyId }} />
    </PageContainer>
  );
}
