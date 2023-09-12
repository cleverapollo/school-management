import { ConfirmDialog, getNumber } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { useParams } from 'react-router-dom';
import { ReturnTypeFromUseNotes } from '../../../api/note/list';
import { useDeleteNote } from '../../../api/note/delete-note';

export interface DeleteNoteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  noteDetails: ReturnTypeFromUseNotes | null;
}

export function DeleteNoteConfirmModal({
  open,
  onClose,
  noteDetails,
}: DeleteNoteConfirmModalProps) {
  const { id } = useParams();
  const studentId = getNumber(id);
  const { t } = useTranslation(['common', 'people']);

  const { mutateAsync: deleteNote } = useDeleteNote(studentId);

  const onSubmit = async () => {
    if (noteDetails?.id) {
      await deleteNote({ noteIds: [noteDetails.id] });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('people:deleteNote')}
      description={t('people:areYouSureYouWantToDeleteNote')}
      confirmText={t('common:delete')}
    />
  );
}
