import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { Card, CardHeader } from '@mui/material';

export default function PermissionManagementPage() {
  const { t } = useTranslation(['settings']);

  return (
    <PageContainer title={t('settings:permissions.permissionManagement')}>
      <PageHeading title={t('settings:permissions.title')} />
      <Card variant="outlined">
        <CardHeader
          component="h2"
          title={t('settings:permissions.permissionsGroups')}
        />
      </Card>
    </PageContainer>
  );
}
