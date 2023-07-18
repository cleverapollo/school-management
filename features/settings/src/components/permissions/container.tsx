import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { PropsWithChildren } from 'react';

type PermissionMode = 'create' | 'edit' | 'clone';

type PermissionContainerProps = PropsWithChildren<{
  mode: PermissionMode;
  groupName?: string;
}>;

export const PermissionContainer = ({
  children,
  mode,
  groupName,
}: PermissionContainerProps) => {
  const { t } = useTranslation(['settings']);

  const breadcrumbLabels: Record<PermissionMode, string> = {
    create: t('settings:permissions.createNewGroup'),
    edit: t('settings:permissions.editGroup', { name: groupName }),
    clone: t('settings:permissions.cloneGroup', { name: groupName }),
  };

  return (
    <PageContainer title={t('settings:permissions.permissionManagement')}>
      <PageHeading
        title={t('settings:permissions.permissionManagement')}
        breadcrumbs={{
          links: [
            {
              name: t('settings:permissions.title'),
              href: '/settings/permissions',
            },
            {
              name: breadcrumbLabels[mode],
            },
          ],
        }}
      />
      {children}
    </PageContainer>
  );
};
