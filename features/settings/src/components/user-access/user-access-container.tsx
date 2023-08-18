import { PageHeading, TabPageContainer, PageContainer } from '@tyro/core';

import { useTranslation } from '@tyro/i18n';

export default function UserAccessContainer() {
  const { t } = useTranslation(['common', 'people', 'settings']);

  return (
    <PageContainer title={t('settings:userAccess')}>
      <PageHeading
        title={t('settings:userAccess')}
        titleProps={{ variant: 'h3' }}
      />
      <TabPageContainer
        links={[
          {
            label: t('common:staff'),
            value: 'staff',
          },
          {
            label: t('people:contacts'),
            value: 'contacts',
          },
          {
            label: t('common:students'),
            value: 'students',
          },
        ]}
      />
    </PageContainer>
  );
}
