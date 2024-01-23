import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useDeleteFee } from '../../api/delete-fee';
import { ReturnTypeFromUseFees } from '../../api/fees';

export interface DeleteFeeConfirmModalProps {
  open: boolean;
  feeToDelete: ReturnTypeFromUseFees | null;
  onClose: () => void;
}

export function DeleteFeeConfirmModal({
  open,
  feeToDelete,
  onClose,
}: DeleteFeeConfirmModalProps) {
  const { t } = useTranslation(['fees', 'common']);

  const { mutate: deleteFee } = useDeleteFee();

  const onSubmit = () => {
    deleteFee({ id: feeToDelete?.id ?? 0 }, { onSuccess: onClose });
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('fees:deleteFee')}
      description={t('fees:deleteFeeConfirmation', {
        feeName: feeToDelete?.name ?? '',
      })}
      confirmText={t('common:actions.delete')}
      isDelete
    />
  );
}
