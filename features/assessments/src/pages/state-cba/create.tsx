import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer, useToast } from '@tyro/core';

import { StateCbaForm } from '../../components/state-cba/form';

export default function CreateStateCbaPage() {
  const { toast } = useToast();

  const { t } = useTranslation(['assessments', 'common']);

  return (
    <PageContainer title={t('assessments:pageTitle.createStateCba')}>
      <PageHeading
        title={t('assessments:pageHeading.stateCba')}
        breadcrumbs={{
          links: [
            {
              name: t('assessments:pageHeading.assessments'),
              href: '/assessments',
            },
            {
              name: t('assessments:pageHeading.stateCbaCreation'),
            },
          ],
        }}
      />

      <StateCbaForm
        title={t('assessments:pageHeading.stateCbaCreation')}
        ctaText={t('assessments:createAssessment')}
        onSuccess={() => {
          toast(t('common:snackbarMessages.createSuccess'));
        }}
        onError={() => {
          toast(t('common:snackbarMessages.errorFailed'), { variant: 'error' });
        }}
      />
    </PageContainer>
  );
}
