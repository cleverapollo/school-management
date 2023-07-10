import { TabPageContainer } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

export default function SyncContainer() {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <TabPageContainer
      links={[
        {
          label: t('settings:sync'),
          value: 'sync',
        },
        {
          label: t('settings:schoolDetails.title'),
          value: 'details',
        },
      ]}
    />
  );
}
