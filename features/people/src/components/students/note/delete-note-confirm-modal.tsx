import { ConfirmDialog } from '@tyro/core';
import { useTranslation } from '@tyro/i18n';
import { ReturnTypeFromUseNotes } from '../../../api/note/list';

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

  const onSubmit = async () => {
    if (noteDetails) {
      // TODO: implement api integration
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
