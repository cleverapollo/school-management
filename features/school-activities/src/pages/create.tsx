import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer, useToast } from '@tyro/core';

import { SchoolActivityForm } from '../components/school-activity-form';

export default function CreateSchoolActivityPage() {
  const { toast } = useToast();

  const { t } = useTranslation(['schoolActivities', 'common']);

  return (
    <PageContainer title={t('schoolActivities:createSchoolActivity')}>
      <PageHeading
        title={t('schoolActivities:title')}
        breadcrumbs={{
          links: [
            {
              name: t('schoolActivities:createSchoolActivity'),

              href: '/school-activities',
            },
            {
              name: t('schoolActivities:schoolActivityCreation'),
            },
          ],
        }}
      />

      <SchoolActivityForm
        title={t('schoolActivities:createSchoolActivity')}
        onSuccess={() => {
          toast(t('common:snackbarMessages.createSuccess'));
        }}
        onError={console.error}
      />
    </PageContainer>
  );
}
