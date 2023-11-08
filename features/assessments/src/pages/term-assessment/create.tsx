import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer, useToast } from '@tyro/core';

import { TermAssessmentForm } from '../../components/term-assessment/form';

export default function CreateTermAssessmentPage() {
  const { toast } = useToast();

  const { t } = useTranslation(['assessments', 'common']);

  return (
    <PageContainer title={t('assessments:pageTitle.createTermAssessment')}>
      <PageHeading
        title={t('assessments:pageHeading.termAssessments')}
        breadcrumbs={{
          links: [
            {
              name: t('assessments:pageHeading.assessments'),
              href: '/assessments',
            },
            {
              name: t('assessments:pageHeading.createTermAssessment'),
            },
          ],
        }}
      />

      <TermAssessmentForm
        title={t('assessments:pageHeading.createTermAssessment')}
        onSuccess={() => {
          toast(t('common:snackbarMessages.createSuccess'));
        }}
        onError={console.error}
      />
    </PageContainer>
  );
}
