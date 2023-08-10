import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
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
  const { t } = useTranslation(['common', 'people']);

  const { mutateAsync: deleteNote } = useDeleteNote();

  const onSubmit = async () => {
    if (noteDetails && noteDetails.id) {
      await deleteNote({ noteIds: [noteDetails.id] });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onSubmit}
      title={t('people:deleteNote')}
      description={t('common:areYouSure')}
      confirmText={t('common:delete')}
    />
  );
}
