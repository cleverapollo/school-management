import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';

export default function CreateContactPage() {
  const { t } = useTranslation(['people', 'common']);

  return (
    <PageContainer title={t('people:pageTitle.createContact')}>
      <PageHeading
        title={t('people:pageHeading.createContact')}
        breadcrumbs={{
          links: [
            {
              name: t('people:pageHeading.contacts'),
              href: '/people/contacts',
            },
            {
              name: t('people:pageHeading.createContact'),
            },
          ],
        }}
      />
      contact form
    </PageContainer>
  );
}
