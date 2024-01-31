import { Card, CardContent, Stack } from '@mui/material';
import {
  ConfirmDialog,
  DynamicForm,
  getNumber,
  PageContainer,
  PageHeading,
  useDisclosure,
  useToast,
} from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInfoRequestFormSetupDetails } from '../api/form-setup';
import { useSaveForm } from '../api/save-form';

export default function InfoRequestFormView() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(['common', 'infoRequests']);
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    isOpen: isCancelModalOpen,
    onOpen: openCancelModal,
    onClose: closeCancelModal,
  } = useDisclosure();

  const formId = {
    name: searchParams.get('name') ?? '',
    provider: searchParams.get('provider') ?? '',
    forPartyId: getNumber(searchParams.get('forPartyId')) ?? 0,
    objectId: getNumber(searchParams.get('objectId')) ?? 0,
  };

  const { data: setupInfo } = useInfoRequestFormSetupDetails({
    id: formId,
  });

  const { mutateAsync: saveForm } = useSaveForm();

  const goBack = () => {
    navigate('/info-requests');
  };

  const title = setupInfo?.title ?? '';

  return (
    <>
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
        {setupInfo?.description && (
          <Card>
            <CardContent>{setupInfo.description}</CardContent>
          </Card>
        )}
        <DynamicForm
          formSettings={setupInfo}
          onSubmit={async (fields) => {
            const { forms_submitInformationRequestForms: formResponse } =
              await saveForm({
                formId,
                fields,
                validateOnly: false,
              });

            if (formResponse.success) {
              toast(t('common:snackbarMessages.createSuccess'));
              goBack();
            }

            return formResponse;
          }}
          onCancel={openCancelModal}
        />
      </PageContainer>
      <ConfirmDialog
        open={isCancelModalOpen}
        title={t('common:cancelConfirmDialog.title')}
        description={t('common:cancelConfirmDialog.description')}
        onClose={closeCancelModal}
        onConfirm={goBack}
      />
    </>
  );
}
