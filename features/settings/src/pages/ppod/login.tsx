import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

import PpodLogin from '../../components/ppod/ppod-login';

export default function Login() {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <PageContainer title={t('settings:ppodCredentials')}>
      <PageHeading
        title={t('settings:ppodCredentials')}
        titleProps={{ variant: 'h3' }}
      />
      <PpodLogin />
    </PageContainer>
  );
}
