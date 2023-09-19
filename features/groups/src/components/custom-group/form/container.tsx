import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { PropsWithChildren } from 'react';

type CustomGroupMode = 'create' | 'edit';

type PermissionContainerProps = PropsWithChildren<{
  mode: CustomGroupMode;
  groupName?: string;
}>;

export const CustomGroupFormContainer = ({
  mode,
  groupName,
  children,
}: PermissionContainerProps) => {
  const { t } = useTranslation(['groups']);

  const breadcrumbLabels: Record<CustomGroupMode, string> = {
    create: t('groups:createCustomGroup'),
    edit: t('groups:editGroup', { name: groupName }),
  };

  return (
    <PageContainer title={t('groups:createCustomGroup')}>
      <PageHeading
        title={t('groups:createCustomGroup')}
        breadcrumbs={{
          links: [
            {
              name: t('groups:customGroups'),
              href: '..',
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
