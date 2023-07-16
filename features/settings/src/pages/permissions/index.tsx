import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { Card, CardHeader, Divider, Stack } from '@mui/material';
import { PresetPermissionsList } from '../../components/permissions/preset-permissions-list';
import { CustomPermissionsList } from '../../components/permissions/custom-permissions-list';

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

        <Stack direction="column" gap={3} p={3}>
          <PresetPermissionsList />
          <Divider />
          <CustomPermissionsList />
        </Stack>
      </Card>
    </PageContainer>
  );
}
