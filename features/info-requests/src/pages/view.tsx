import { DynamicForm, PageContainer, PageHeading, useToast } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { redirect, useSearchParams } from 'react-router-dom';
import { useInfoRequestFormSetupDetails } from '../api/form-setup';
import { useSaveForm } from '../api/save-form';

export default function InfoRequestFormView() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(['common', 'infoRequests']);
  const { toast } = useToast();

  const formId = {
    name: searchParams.get('name') ?? '',
    provider: searchParams.get('provider') ?? '',
  };

  const { data: setupInfo } = useInfoRequestFormSetupDetails({
    id: formId,
  });

  const { mutateAsync: saveForm } = useSaveForm();

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
        onSubmit={async (fields) => {
          const { forms_submitInformationRequestForms: formResponse } =
            await saveForm({
              formId,
              fields,
              validateOnly: false,
            });

          console.log({
            fields,
            formResponse,
          });

          if (formResponse.success) {
            toast(t('common:snackbarMessages.createSuccess'));
            redirect('/info-requests');
          }

          return formResponse;
        }}
      />
    </PageContainer>
  );
}
