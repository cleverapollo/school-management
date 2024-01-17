import { useTranslation } from '@tyro/i18n';
import { ConfirmDialog } from '@tyro/core';
import { useDeleteBehaviour } from '../../api/behaviour/delete-behaviour';

interface ConfirmDeleteBehaviourProps {
  idToDelete?: number | null;
  onClose: () => void;
}

export function ConfirmDeleteBehaviour({
  idToDelete,
  onClose,
}: ConfirmDeleteBehaviourProps) {
  const { t } = useTranslation(['common', 'people']);

  const { mutateAsync: deleteBehaviour } = useDeleteBehaviour();

  const onConfirmDelete = async () => {
    if (idToDelete) {
      await deleteBehaviour({ noteIds: [idToDelete] }, { onSuccess: onClose });
    }
  };

  return (
    <ConfirmDialog
      isDelete
      open={!!idToDelete}
      title={t('people:deleteBehaviour')}
      description={t('people:areYouSureYouWantToDeleteBehaviour')}
      confirmText={t('common:delete')}
      onClose={onClose}
      onConfirm={onConfirmDelete}
    />
  );
}
