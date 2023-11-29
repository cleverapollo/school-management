import { PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { SubjectOptionsSetupForm } from '../components/setup/form';

export default function CreateSubjectOptionsPage() {
  const { t } = useTranslation(['navigation', 'subjectOptions']);

  return (
    <PageContainer title={t('subjectOptions:createSubjectOptions')}>
      <PageHeading
        title={t('subjectOptions:createSubjectOptions')}
        breadcrumbs={{
          links: [
            {
              name: t('navigation:management.subjectOptions'),
              href: '/people/contacts',
            },
            {
              name: t('subjectOptions:createSubjectOptions'),
            },
          ],
        }}
      />
      <SubjectOptionsSetupForm />
    </PageContainer>
  );
}
