import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { PropsWithChildren } from 'react';

type PermissionContainerProps = PropsWithChildren<unknown>;

export const PermissionContainer = ({ children }: PermissionContainerProps) => {
  const { t } = useTranslation(['settings']);

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
              name: t('settings:permissions.permissionManagement'),
            },
          ],
        }}
      />
      {children}
    </PageContainer>
  );
};
