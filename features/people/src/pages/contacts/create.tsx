import { useTranslation } from '@tyro/i18n';
import { PageHeading, PageContainer } from '@tyro/core';
import { ContactForm } from '../../components/contacts/contact-form';

export default function CreateContactPage() {
  const { t } = useTranslation(['people']);

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
      <ContactForm />
    </PageContainer>
  );
}
