import { getNumber, PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router-dom';
import { useOptionsSetup } from '../api/options';
import { SubjectOptionsSetupForm } from '../components/setup/form';

export default function EditSubjectOptionsPage() {
  const { id } = useParams();
  const optionId = getNumber(id) ?? 0;
  const { t } = useTranslation(['navigation', 'subjectOptions']);

  const { data: optionsSetup } = useOptionsSetup(optionId);

  const title = t('subjectOptions:editSubjectOptions', {
    name: optionsSetup?.name ?? '',
  });

  return (
    <PageContainer title={title}>
      <PageHeading
        title={title}
        breadcrumbs={{
          links: [
            {
              name: t('navigation:management.subjectOptions'),
              href: '/subject-options',
            },
            {
              name: title,
            },
          ],
        }}
      />
      <SubjectOptionsSetupForm defaultOptionsSetup={optionsSetup} />
    </PageContainer>
  );
}
