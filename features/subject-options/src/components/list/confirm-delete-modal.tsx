import { useTranslation } from '@tyro/i18n';
import { ConfirmDialog } from '@tyro/core';
import { ReturnTypeFromUseOptionsSetupList } from '../../api/options';
import { useDeleteOptions } from '../../api/delete-options';

interface ConfirmDeleteModalProps {
  optionsToDelete: ReturnTypeFromUseOptionsSetupList | null;
  open: boolean;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  optionsToDelete,
  open,
  onClose,
}: ConfirmDeleteModalProps) {
  const { t } = useTranslation(['common', 'subjectOptions']);

  const { mutateAsync } = useDeleteOptions();

  const onConfirmDelete = () => {
    if (optionsToDelete?.id) {
      return mutateAsync(
        {
          optionId: optionsToDelete.id,
        },
        {
          onSuccess: onClose,
        }
      );
    }
  };

  return (
    <ConfirmDialog
      isDelete
      open={open}
      title={t('subjectOptions:deleteOptions')}
      description={t('subjectOptions:areYouSureYouWantToDelete', {
        optionsName: optionsToDelete?.name ?? '',
      })}
      confirmText={t('common:actions.delete')}
      onClose={onClose}
      onConfirm={onConfirmDelete}
    />
  );
}
