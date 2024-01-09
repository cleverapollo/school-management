import { useState } from 'react';
import { useTranslation } from '@tyro/i18n';
import {
  PageHeading,
  PageContainer,
  useDisclosure,
  useToast,
} from '@tyro/core';

import { StateCbaForm } from '../../components/state-cba/form';
import { ErrorMessageModal } from '../../components/state-cba/error-message-modal';

export default function CreateStateCbaPage() {
  const [errorResponse, setErrorResponse] = useState<string | null>(null);

  const { toast } = useToast();

  const { t } = useTranslation(['assessments', 'common']);

  const {
    isOpen: isErrorModalOpen,
    onOpen: onErrorModalOpen,
    onClose: onCloseErrorModal,
  } = useDisclosure();

  return (
    <>
      <PageContainer title={t('assessments:pageTitle.createStateCba')}>
        <PageHeading
          title={t('assessments:pageHeading.stateCba')}
          breadcrumbs={{
            links: [
              {
                name: t('assessments:pageHeading.assessments'),
                href: '/assessments',
              },
              {
                name: t('assessments:pageHeading.stateCbaCreation'),
              },
            ],
          }}
        />

        <StateCbaForm
          title={t('assessments:pageHeading.stateCbaCreation')}
          onSuccess={() => {
            toast(t('common:snackbarMessages.createSuccess'));
          }}
          onError={() => {
            toast(t('common:snackbarMessages.errorFailed'), {
              variant: 'error',
            });
          }}
          onErrorModalOpen={onErrorModalOpen}
          setErrorResponse={setErrorResponse}
        />
      </PageContainer>
      <ErrorMessageModal
        isOpen={isErrorModalOpen}
        onClose={onCloseErrorModal}
        assessmentId={errorResponse}
      />
    </>
  );
}
