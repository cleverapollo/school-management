import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseStudentAen } from '../../../api/student/aen/student-aen-data';
import { useDeleteAen } from '../../../api/student/aen/delete-student-aen';

export interface DeleteAenConfirmModalProps {
  open: boolean;
  onClose: () => void;
  aenDetails: ReturnTypeFromUseStudentAen['entries'][number] | null;
}

export function DeleteAenConfirmModal({
  open,
  onClose,
  aenDetails,
}: DeleteAenConfirmModalProps) {
  const { t } = useTranslation(['common', 'people']);

  const { mutateAsync: deleteNote } = useDeleteAen();

  const onSubmit = async () => {
    if (aenDetails?.id && aenDetails?.studentPartyId) {
      await deleteNote({
        id: aenDetails.id,
        studentPartyId: aenDetails.studentPartyId,
      });
    }
  };

  return (
    <ConfirmDialog
      isDelete
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('people:deleteNote')}
      description={t('people:areYouSureYouWantToDeleteNote')}
      confirmText={t('common:delete')}
    />
  );
}
