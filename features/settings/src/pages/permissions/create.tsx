import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { PermissionForm } from '../../components/permissions/permission-form';

export default function CreatePermissionPage() {
  const { t } = useTranslation(['settings']);

  return (
    <PageContainer title={t('settings:permissions.permissionManagement')}>
      <PageHeading
        title={t('settings:permissions.permissionManagement')}
        breadcrumbs={{
          links: [
            {
              name: t('settings:permissions.title'),
              href: './..',
            },
            {
              name: t('settings:permissions.permissionManagement'),
            },
          ],
        }}
      />
      <PermissionForm />
    </PageContainer>
  );
}
