import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useDeleteDiscount } from '../../api/delete-discount';
import { ReturnTypeFromUseDiscounts } from '../../api/discounts';

export interface DeleteDiscountConfirmModalProps {
  open: boolean;
  discountToDelete: ReturnTypeFromUseDiscounts;
  onClose: () => void;
}

export function DeleteDiscountConfirmModal({
  open,
  discountToDelete,
  onClose,
}: DeleteDiscountConfirmModalProps) {
  const { t } = useTranslation(['fees', 'common']);

  const { mutate: deleteDiscount } = useDeleteDiscount();

  const onSubmit = () => {
    deleteDiscount({ id: discountToDelete?.id ?? 0 }, { onSuccess: onClose });
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('fees:deleteDiscount')}
      description={t('fees:deleteDiscountConfirmation')}
      confirmText={t('common:actions.delete')}
    />
  );
}
