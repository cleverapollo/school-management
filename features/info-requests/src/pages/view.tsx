import { DynamicForm, PageContainer, PageHeading } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useSearchParams } from 'react-router-dom';
import { useInfoRequestFormSetupDetails } from '../api/form-setup';

export default function InfoRequestFormView() {
  const [searchParams] = useSearchParams();

  const { t } = useTranslation(['infoRequests']);

  const { data: setupInfo } = useInfoRequestFormSetupDetails({
    id: {
      name: searchParams.get('name') ?? '',
      provider: searchParams.get('provider') ?? '',
    },
  });

  const title = setupInfo?.title ?? '';

  return (
    <PageContainer title={title}>
      <PageHeading
        title={title}
        breadcrumbs={{
          links: [
            {
              name: t('infoRequests:informationRequests'),
              href: '/info-requests',
            },
            {
              name: title,
            },
          ],
        }}
      />
      <DynamicForm
        formSettings={setupInfo}
        onSubmit={(data) =>
          console.log({
            data,
          })
        }
      />
    </PageContainer>
  );
}
