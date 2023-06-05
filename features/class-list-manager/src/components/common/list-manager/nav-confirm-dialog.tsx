import { unstable_useBlocker as useBlocker } from 'react-router-dom';
import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';

interface NavConfirmDialogProps {
  isDirty: boolean;
}

export function NavConfirmDialog({ isDirty }: NavConfirmDialogProps) {
  const { t } = useTranslation(['common', 'classListManager']);

  const blocker = useBlocker(isDirty);

  return (
    <ConfirmDialog
      open={blocker.state === 'blocked'}
      title={t('common:confirmDialog.areYouSureYouWantToChangePage')}
      description={t('common:confirmDialog.youHaveUnsavedChanges')}
      confirmText={t('common:actions.continue')}
      onConfirm={() => blocker?.proceed?.()}
      onClose={() => blocker?.reset?.()}
    />
  );
}
