import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { StaffForm } from '../../components/staff/staff-form';

export default function CreateStaffPage() {
  const { t } = useTranslation(['people']);

  return (
    <PageContainer title={t('people:pageTitle.createStaff')}>
      <PageHeading
        title={t('people:pageHeading.createStaff')}
        breadcrumbs={{
          links: [
            {
              name: t('people:pageHeading.staff'),
              href: '/people/staff',
            },
            {
              name: t('people:pageHeading.createStaff'),
            },
          ],
        }}
      />
      <StaffForm />
    </PageContainer>
  );
}
