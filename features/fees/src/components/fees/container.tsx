import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { PropsWithChildren } from 'react';

type FeeMode = 'create' | 'edit';

type FeeContainerProps = PropsWithChildren<{
  mode: FeeMode;
  feeName?: string;
}>;

export const FeeContainer = ({
  children,
  mode,
  feeName,
}: FeeContainerProps) => {
  const { t } = useTranslation(['fees', 'navigation']);

  const breadcrumbLabels: Record<FeeMode, string> = {
    create: t('fees:createFee'),
    edit: t('fees:editFee', { name: feeName }),
  };

  return (
    <PageContainer title={t('fees:feeManagement')}>
      <PageHeading
        title={t('fees:feeManagement')}
        breadcrumbs={{
          links: [
            {
              name: t('navigation:management.fees.overview'),
              href: '/fees/overview',
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
